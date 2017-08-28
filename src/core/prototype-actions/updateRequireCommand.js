import fs from 'fs'
import path from 'path'

const generateRequireCmd = (moduleName, requireCmd) => {
    // Extract string inside require()
    const locateMainFile = /'[^']+'|"[^"]+"/

    // Get the path to module's index file
    const moduleIndex = requireCmd.match(locateMainFile)[0]
        .replace(/'|"/g, '') // Remove quote marks

    // Replace str inside require() with new str incl path to module subfolder
    const includeString = requireCmd.replace(locateMainFile, `"${moduleName}/${moduleIndex}"`)
    return includeString + '\n'
}

const updateFoldRanges = (prototypePath, shiftBy, callback) => {
    const extractFirstNumber = /\d+/
    const configFile = path.join(prototypePath, 'framer', 'config.json')
    let configuration = require(configFile)

    const newRange = []

    /*
    Configuration for code folds is an array of ranges (strings):
    '{ startingCharacterNumber, numberOfCharactersInFold }'

    e.g.:
    "foldedCodeRanges": [
        "{68, 1039}",
        "{1108, 2066}"
    ]

    With every new require() command un/written to app.coffee, we need to shift
    code fold ranges to maintain the folds in Framer Studio.

    e.g. when writing require string that is 68 characters long,
         '{1, 1039}' becomes '{69, 1039}'
    */
    configuration.foldedCodeRanges.forEach(range => {
        const firstNumber = parseInt( extractFirstNumber.exec(range)[0] )
        const firstNumberShift = firstNumber + shiftBy

        newRange.push( range.replace(extractFirstNumber, firstNumberShift) )
    })

    configuration.foldedCodeRanges = newRange

    try {
        fs.writeFileSync(configFile, JSON.stringify(configuration, null, 2), 'utf-8')
        return callback(null)
    } catch (err) { return callback(err) }
}

const updateRequireCommand = (framerModule, prototypePath, install = false, callback) => {
    const { unique_name: moduleName, require: includeRule } = framerModule
    const prototypeApp = path.join(prototypePath, 'app.coffee')

    // Generate require() command with path to module subfolder
    const inclString = generateRequireCmd(moduleName, includeRule)

    /* Updating app.coffee asynchronously from >1 processes
       seems to be a dangerous task. Using synchronous execution instead */
    try {
        const appCopy = fs.readFileSync(prototypeApp, 'utf-8')
        if (!install && appCopy.indexOf(inclString) === -1) return callback(null)

        const newAppContent = install
            ? inclString + appCopy
            : appCopy.toString('utf-8').replace(inclString, '')

        try {
            fs.writeFileSync(prototypeApp, newAppContent, 'utf-8')

            const shiftFoldsBy = install ? inclString.length : -inclString.length
            updateFoldRanges(prototypePath, shiftFoldsBy, err => {
                return callback(err)
            })
        } catch (err) { return callback(err) }
    } catch (err) { return callback(err) }
}

export { updateRequireCommand }
