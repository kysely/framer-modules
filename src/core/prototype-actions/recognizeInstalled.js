import fs from 'fs'
import path from 'path'

const nonModuleFiles = [
    '.DS_Store'
]

const recognizeInstalled = (prototypePath, callback) => {
    const prototypeModulesFolder = path.join(prototypePath, 'modules')
    const modules = {
        recognized: [],
        unknown: []
    }

    fs.readdir(prototypeModulesFolder, 'utf-8', (err, files) => {
        if (err) return callback(err.message, null)

        files.forEach(file => {
            if (nonModuleFiles.indexOf(file) > -1) return false

            const moduleJson = path.join(prototypeModulesFolder, file, 'module.json')

            try {
                const moduleObject = fs.readFileSync(moduleJson, 'utf-8')
                modules.recognized.push(JSON.parse(moduleObject))
            } catch (err) {
                modules.unknown.push(file)
            }
        })

        return callback(null, modules)
    })
}

export { recognizeInstalled }
