import ServerRequest from './ServerRequest'
import config from './storage'
import Response from './Response'
import parseGitHubURL from './parseGitHubURL'
import { clipboard } from 'electron'
import { installModules, removeModules, copySnippet } from './prototype-actions/installRemove'
import { recognizeInstalled } from './prototype-actions/recognizeInstalled'
import { addToPreset, getPresets, deletePreset, editPreset, getUniques } from './handlePresets'

const Actions = {}

Actions.sendOpenUpdate = (win, path) => {
    config.set('openPrototype', path)

    /* Note that 'ipcMain' module doesn't have a method for initiating
       a communication with the renderer process, thus we need to send
       the message via window's webContents */
    win.webContents.send('openUpdate', path)
}

Actions.tryNew = (event, gitHubURL) => {
    const encGitHubURL = encodeURIComponent(gitHubURL)

    ServerRequest.get(`/tryNew/${encGitHubURL}`, res => {
        const err = res.status === 'ERR' ? res.message : null
        const data = res
        event.sender.send('tryNewRes', Response(err, data))
    })
}

Actions.publishNew = (event, gitHubURL) => {
    ServerRequest.post('/publishNew', { gitHubURL: gitHubURL }, res => {
        const err = res.status === 'OK' ? null : res.message
        const data = res
        event.sender.send('publishNewRes', Response(err, data))
    })
}

Actions.search = (event, query) => {
    const encQuery = encodeURIComponent(query)

    ServerRequest.get(`/search/${encQuery}`, res => {
        const err = res.status === 'ERR' ? res.message : null
        const data = res.data === null ? [] : res.data
        event.sender.send('searchRes', Response(err, data))
    })
}

Actions.install = (event, moduleObject) => {
    // Response is an array of objects: { module: <moduleName>, status: OK|ERR }
    installModules(moduleObject, config.get('openPrototype'), res => {
        let err = null
        let data = true
        res.forEach(module => {
            if (module.status !== 'OK') {
                data = false
                err = `Couldn't install ${module.module}: ${module.status}`
            }
        })
        event.sender.send('installRes', Response(err, data))
    })
}

Actions.remove = (event, moduleObject) => {
    // Response is an array of objects: { module: <moduleName>, status: OK|ERR }
    removeModules(moduleObject, config.get('openPrototype'), res => {
        let err = null
        let data = true
        res.forEach(module => {
            if (module.status !== 'OK') {
                data = false
                err = `Couldn't remove ${module.module}: ${module.status}`
            }
        })
        event.sender.send('removeRes', Response(err, data))
    })
}

Actions.installed = (event) => {
    recognizeInstalled(config.get('openPrototype'), (error, modules) => {
        const err = error
        const data = modules
        event.sender.send('installedRes', Response(err, data))
    })
}

Actions.checkName = (event, moduleName) => {
    const encModuleName = encodeURIComponent(moduleName)

    ServerRequest.get(`/checkName/${encModuleName}`, res => {
        event.sender.send('checkNameRes', res)
    })
}

Actions.copySnippet = (event, moduleObject) => {
    copySnippet(moduleObject, (err, res) => {
        clipboard.writeText(res)
        event.sender.send('copySnippetRes', Response(err))
    })
}

Actions.installPreset = (event, presetName) => {
    ServerRequest.get('/preset', { modules: getUniques(presetName) }, res => {
        let err = res.status === 'ERR' ? res.message : null
        let data = res.data === null ? [] : res.data
        if (err) return event.sender.send('installPresetRes', Response(err, data))

        installModules(data, config.get('openPrototype'), res => {
            err = null
            data = true
            res.forEach(module => {
                if (module.status !== 'OK') {
                    data = false
                    err = `Couldn't install ${module.module}: ${module.status}`
                }
            })
            event.sender.send('installPresetRes', Response(err, data))
        })
    })
}

Actions.addToPreset = (event, action) => {
    event.returnValue = addToPreset(action)
}

Actions.editPreset = (event, action) => {
    event.returnValue = editPreset(action)
}

Actions.deletePreset = (event, preset) => {
    event.returnValue = deletePreset(preset)
}

Actions.getModule = (moduleName, callback) => {
    ServerRequest.get(`/module/${moduleName}`, res => {
        return callback(res)
    })
}

Actions.updateStats = (moduleName, installed = true) => {
    const path = installed ? 'installed' : 'uninstalled'
    ServerRequest.put(`/${path}/${moduleName}`)
}

Actions.getPresets = (event) => {
    event.returnValue = getPresets()
}

Actions.getPrototype = (event) => {
    event.returnValue = config.get('openPrototype')
}

Actions.getOffered = (event) => {
    event.returnValue = config.get('offeredPrototypes')
}

Actions.getThumb = (event, module) => {
    event.returnValue = `${parseGitHubURL(module.github)}${module.thumb}`
}

export default Actions
