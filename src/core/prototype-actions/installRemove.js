import fs from 'fs'
import path from 'path'
import url from 'url'
import request from 'request'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { updateRequireCommand } from './updateRequireCommand'
import parseGitHubURL from '../parseGitHubURL'
import Actions from '../Actions'

const getDirectoryTree = (dest, callback) => {
    // Get the path of file's directory (remove filename)
    const destDirectory = dest.replace(/\/[^\/]+$/, '')

    mkdirp(destDirectory, err => callback(err))
}

const installFileFromGitHub = (fileOnGitHub, fileInPrototype, callback) => {
    let reqStatCode = 0

    // First, if needed, create a hierarchy of directories for the file
    getDirectoryTree(fileInPrototype, err => {
        if (err) return callback(err.message)

        // Can't fetch and write the whole directory (yet :D)
        if (fileInPrototype.endsWith('/')) return callback('CAN\'T WRITE THE WHOLE DIRECTORY')

        const streamToFileInPrototype = fs.createWriteStream(fileInPrototype)

        // Fetch the file from GitHub
        request.get(fileOnGitHub)
            .on('response', res => {
                reqStatCode = res.statusCode
            })
            .on('error', err => {
                fs.unlink(fileInPrototype)
                return callback(`WEB REQUEST ERROR: ${err.message}`)
            })
            .pipe(streamToFileInPrototype)

        // Handle the content streaming to the file
        streamToFileInPrototype
            .on('finish', () => {
                streamToFileInPrototype.close(() => {
                    if (reqStatCode !== 200) {
                        fs.unlink(fileInPrototype)
                        return callback(`ERROR ${reqStatCode}: DIDN'T WRITE THE FILE`)
                    }
                    return callback(null)
                })
            })
            .on('error', err => {
                fs.unlink(fileInPrototype)
                return callback(`FILE WRITE ERROR: ${err.message}`)
            })
    })
}

const filesToInstall = framerModule => {
    const { install: installFiles } = framerModule

    return Array.isArray(installFiles) ? installFiles : [installFiles]
}

const isInstalled = (framerModule, prototypePath, subPath = '') => {
    const { unique_name: moduleName } = framerModule
    const prototypeModuleFolder = path.join(prototypePath, 'modules', subPath, moduleName)

    try {
        fs.accessSync(prototypeModuleFolder)
        return true
    } catch (err) {
        return false
    }
}

const installModuleJson = (framerModule, prototypePath, subPath, callback) => {
    if (subPath) return callback(null)
    const moduleJsonPath = path.join(prototypePath, 'modules', framerModule.unique_name, 'module.json')

    getDirectoryTree(moduleJsonPath, err => {
        if (err) return callback(err.message)

        fs.writeFile(moduleJsonPath, JSON.stringify(framerModule), {flag:'w+'}, err => {
            if (err) return callback(err)
            return callback(null)
        })
    })
}

const getDependencyModule = (dependencyName, callback) => {
    Actions.getModule(dependencyName, res => {
        if (res.status === 'NFOUND') return callback(res.message, null)
        return callback(null, res.data)
    })
}

const installDependencies = (dependantModule, prototypePath, subPath, callback) => {
    const { unique_name: dependantName, dependencies } = dependantModule

    /* If the dependant module doesn't have any dependencies,
       callback to continue installing the module itself */
    if (!dependencies || dependencies.length === 0) return callback(null)

    /* When there are dependencies, install all of those first,
       then go on installing the dependant module */
    dependencies.forEach((dep, index, deps) => {
        const newSubPath = path.join(subPath, dependantName)

        getDependencyModule(dep, (err, dependencyModule) => {
            if (err) return callback(err)

            installSingleModule(dependencyModule, prototypePath, newSubPath, err => {
                if (err) return callback(err)
                if (index === deps.length-1) return callback(null)
            })
        })
    })
}

const installSingleModule = (framerModule, prototypePath, subPath = '', callback) => {
    if (isInstalled(framerModule, prototypePath, subPath)) return callback(null)

    const {
        unique_name: moduleName,
        github: moduleRepo
    } = framerModule

    const gitHubRepo = parseGitHubURL(moduleRepo)
    const prototypeModulesFolder = path.join(prototypePath, 'modules', subPath)

    installDependencies(framerModule, prototypePath, subPath, err => {
        if (err) return callback(err)

        installModuleJson(framerModule, prototypePath, subPath, err => {
            if (err) return callback(err)

            let calledTimes = 0
            filesToInstall(framerModule).forEach((file, i, files) => {
                // Strip any possible / or ./ in the beginning of the filename
                const fileName = file.replace(/^\/|^\.\//, '')

                const pathToFilePrototype = path.join(prototypeModulesFolder, moduleName, fileName)
                const pathToFileGitHub = url.resolve(gitHubRepo, fileName)

                installFileFromGitHub(pathToFileGitHub, pathToFilePrototype, err => {
                    if (err) return callback(err)

                    /* When all files for the module are installed, consider callback.
                       It's tempting to use i === files.length-1, but i is bound to
                       forEach method, not the received callback for each file. */
                    if (calledTimes++ === files.length-1) {
                        // If the installed module is a dependency, leave here
                        if (subPath) return callback(null)

                        updateRequireCommand(framerModule, prototypePath, true, err => {
                            if (err) return callback(err)
                            return callback(null)
                        })
                    }
                })
            })
        })
    })

}

const removeSingleModule = (framerModule, prototypePath, callback) => {
    if (!isInstalled(framerModule, prototypePath)) return callback(null)

    const { unique_name: moduleName } = framerModule
    const prototypeModulesFolder = path.join(prototypePath, 'modules')

    rimraf(path.join(prototypeModulesFolder, moduleName), err => {
        if (err) return callback(err)

        updateRequireCommand(framerModule, prototypePath, false, err => {
            if (err) return callback(err)
            return callback(null)
        })
    })
}

const removeModules = (framerModules, prototypePath, callback = () => {}) => {
    const modulesArray = Array.isArray(framerModules) ? framerModules : [framerModules]
    const results = []
    let calledTimes = 0

    modulesArray.forEach(framerModule => {
        removeSingleModule(framerModule, prototypePath, err => {
            if (err) {
                results.push({module: framerModule.name, status: err})
            }

            if (!err) {
                Actions.updateStats(framerModule.unique_name, false)
                results.push({module: framerModule.name, status: 'OK'})
            }
            if (calledTimes++ === modulesArray.length-1) return callback(results)
        })
    })
}

const installModules = (framerModules, prototypePath, callback = () => {}) => {
    const modulesArray = Array.isArray(framerModules) ? framerModules : [framerModules]
    const results = []
    let calledTimes = 0

    modulesArray.forEach(framerModule => {
        installSingleModule(framerModule, prototypePath, undefined, err => {
            if (err) {
                results.push({module: framerModule.name, status: err})

                removeSingleModule(framerModule, prototypePath, err => {
                    if (err) throw err
                })
            }


            if (!err) {
                Actions.updateStats(framerModule.unique_name, true)
                results.push({module: framerModule.name, status: 'OK'})
            }
            if (calledTimes++ === modulesArray.length-1) return callback(results)
        })
    })
}

const copySnippet = (framerModule, callback) => {
    const {
        github: moduleRepo,
        example: exampleFile
    } = framerModule

    const snippetURL = url.resolve(parseGitHubURL(moduleRepo), exampleFile)

    request(snippetURL, (err, res, responseData) => {
        if (err) return callback(err.message, null)
        return callback(null, responseData)
    })

}

export { installModules, removeModules, copySnippet }
