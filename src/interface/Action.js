// This lets renderer process communicate with the main process (app)
import { ipcRenderer, clipboard, shell } from 'electron'

const Action = {}

Action.updateOpen = callback => {
    ipcRenderer.on('openUpdate', (event, newOpen) => {
        return callback(newOpen)
    })
}

Action.openURLScheme = callback => {
    ipcRenderer.on('openURLScheme', (event, query) => {
        return callback(query)
    })
}

Action.cmdV = () => clipboard.readText()

Action.openLink = link => shell.openExternal(link)

Action.hide = () => {
    ipcRenderer.send('hide')
}

Action.openPrototypeDialog = () => {
    ipcRenderer.send('openPrototypeDialog')
}

Action.closePrototype = () => {
    ipcRenderer.send('closePrototype')
}

Action.loadPrototype = path => {
    ipcRenderer.send('loadPrototype', path)
}

Action.tryNew = (gitHubURL, callback) => {
    ipcRenderer.send('tryNew', gitHubURL)

    ipcRenderer.once('tryNewRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.publishNew = (gitHubURL, callback) => {
    ipcRenderer.send('publishNew', gitHubURL)

    ipcRenderer.once('publishNewRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.search = (query, /*page,*/ callback) => {
    ipcRenderer.send('search', query)

    ipcRenderer.once('searchRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.checkName = (moduleName, callback) => {
    ipcRenderer.send('checkName', moduleName)

    ipcRenderer.once('checkNameRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.install = (moduleObject, callback) => {
    ipcRenderer.send('install', moduleObject)

    ipcRenderer.once('installRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.remove = (moduleObject, callback) => {
    ipcRenderer.send('remove', moduleObject)

    ipcRenderer.once('removeRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.installed = (callback) => {
    ipcRenderer.send('installed')

    ipcRenderer.once('installedRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.copySnippet = (moduleObject, callback) => {
    ipcRenderer.send('copySnippet', moduleObject)

    ipcRenderer.once('copySnippetRes', (event, res) => {
        return callback(res.err)
    })
}

Action.installPreset = (presetName, callback) => {
    ipcRenderer.send('installPreset', presetName)

    ipcRenderer.once('installPresetRes', (event, res) => {
        return callback(res.err, res.data)
    })
}

Action.addToPreset = action => ipcRenderer.sendSync('addToPreset', action)

Action.deletePreset = preset => ipcRenderer.sendSync('deletePreset', preset)

Action.editPreset = action => ipcRenderer.sendSync('editPreset', action)

Action.getPresets = () => ipcRenderer.sendSync('getPresets')

Action.getPrototype = () => ipcRenderer.sendSync('getPrototype')

Action.getOffered = () => ipcRenderer.sendSync('getOffered')

Action.getThumb = (singleModule) => ipcRenderer.sendSync('getThumb', singleModule)
