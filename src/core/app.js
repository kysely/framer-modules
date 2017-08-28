import fs from 'fs'
import path from 'path'
import { app, BrowserWindow, ipcMain, Menu, Tray, globalShortcut, screen, dialog } from 'electron'

import checkForUpdates from './update'
import Actions from './Actions'
import config from './storage'
import findOpen from './findOpen'
import packagejson from '../../package.json'

// HELPER FUNCTIONS —————————————————————————————

const createWindow = (width = 680, height = 480) => {
    const Screen = screen.getPrimaryDisplay().workAreaSize

    return new BrowserWindow({
        width,
        height,
        x: Screen.width/2 - width/2,
        y: 180,
        useContentSize: true,
        frame: false,
        resizable: false,
        vibrancy: 'ultra-dark',
        fullscreen: false,
        show: false,
        webPreferences: {
            devTools: true,
        }
    })
}

const trayIconMethods = {
    iconPath: path.join(__dirname, '..', '..', 'iconTemplate@2x.png'),
    setDefaultImage: function() {
        this.setTitle('')
    },
    setDragImage: function() {
        this.setTitle('Drop to manage the prototype')
    },
    openDropped: function(event, files) {
        loadPrototype(files[0])
    },
}

const windowMethods = {
    hide: () => mainWindow.hide(),
    show: (delay = 1000) => {
        mainWindow.show()

        findOpen(delay, paths => {
            if (paths.length === 0) return

            const openPrototype = config.get('openPrototype')

            if ( !paths.includes(openPrototype) ) {
                if (paths.length === 1) return loadPrototype(paths[0])

                Actions.sendOpenUpdate(mainWindow, null)
            }
        })
    },
    closePrototype: () => {
        Actions.sendOpenUpdate(mainWindow, null)
        windowMethods.show()
    },
    openPrototypeDialog: () => {
        dialog.showOpenDialog({ properties: ['openDirectory'] },
            (directories) => {
                if (directories) loadPrototype(directories[0])
            }
        )
    }
}

const menuTemplate = [
    {
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'Prototype',
        submenu: [
            {
                label: 'Open Prototype...',
                accelerator: 'Cmd+O',
                click: windowMethods.openPrototypeDialog
            },
            { type: 'separator' },
            { label: 'Close Window', accelerator: 'Cmd+W', click: windowMethods.hide },
            { label: 'Hide Window', accelerator: 'Cmd+H', click: windowMethods.hide },
        ]
    },
]

const loadPrototype = path => {
    if (path === null) {
        Actions.sendOpenUpdate(mainWindow, prototypePath)
        mainWindow.show()
    }

    // Check if the filepath ends with '.framer' or 'app.coffee'
    if (!/\.framer$|app\.coffee$/.test(path)) {
        dialog.showErrorBox(
            'I might be wrong',
            'But this folder doesn\'t look like a Framer prototype')
        return
    }

    // Filter out everything after '.framer' in the path
    const prototypePath = path.match(/.*\.framer/)[0]

    fs.access(prototypePath, fs.constants.W_OK, err => {
        if (err) {
            dialog.showErrorBox(
                'Oops!',
                'It seems I cannot access this Framer prototype')
            return
        }
        Actions.sendOpenUpdate(mainWindow, prototypePath)
        mainWindow.show()
    })
}

// MAIN APP —————————————————————————————————————

let mainWindow, trayIcon

app.setName(packagejson.productName)
app
    .on('will-finish-launching', () => {
        app.on('open-url', (e, url) => {
            e.preventDefault()
            const moduleName = `:${decodeURIComponent(url.replace(/framermodules:\/\//, ''))}`

            const trySendUpdate = setInterval(() => {
                if (app.isReady() && mainWindow) {
                    if ( !mainWindow.webContents.isLoading() ) {
                        clearInterval(trySendUpdate)
                        mainWindow.webContents.send('openURLScheme', moduleName)
                    }
                    windowMethods.show()
                }
            }, 200)

        })
    })
    .on('ready', () => {
        // Menu init
        Menu.setApplicationMenu( Menu.buildFromTemplate(menuTemplate) )

        // Window init
        mainWindow = createWindow()
        mainWindow.loadURL(`file://${path.join(__dirname, '..', '..', 'app', 'interface', 'index.html')}`)

        // Tray icon and its events
        trayIcon = new Tray(trayIconMethods.iconPath)
        trayIcon.setToolTip(`⌘; to open. ${packagejson.productName} v${packagejson.version}`)
        trayIcon
            .on('click',      windowMethods.show)
            .on('drag-enter', trayIconMethods.setDragImage)
            .on('drag-leave', trayIconMethods.setDefaultImage)
            .on('drag-end',   trayIconMethods.setDefaultImage)
            .on('drop-files', trayIconMethods.openDropped)

        // Global shortcut for opening the window
        globalShortcut.register('Cmd+;', windowMethods.show)

        // Window events
        mainWindow.once('ready-to-show', () => windowMethods.show(0))
        mainWindow.on('blur', mainWindow.hide)

        // Check for updates on startup
        checkForUpdates()
    })
    .on('activate', () => {
        windowMethods.show()
    })
    .on('before-quit', () => {
        config.set('openPrototype', null)
        config.set('offeredPrototypes', [])
        globalShortcut.unregisterAll()
    })
    .on('window-all-closed', () => {
        /* This is safe since ⌘W is bound to windowMethods.hide(),
           not actually closing the window */
        app.quit()
    })
    .dock.hide()

// Actions requests from renderer process
ipcMain
    .on('tryNew', Actions.tryNew)
    .on('publishNew', Actions.publishNew)
    .on('search', Actions.search)
    .on('checkName', Actions.checkName)
    .on('install', Actions.install)
    .on('remove', Actions.remove)
    .on('installed', Actions.installed)
    .on('getPresets', Actions.getPresets)
    .on('copySnippet', Actions.copySnippet)
    .on('addToPreset', Actions.addToPreset)
    .on('deletePreset', Actions.deletePreset)
    .on('editPreset', Actions.editPreset)
    .on('installPreset', Actions.installPreset)
    .on('getPrototype', Actions.getPrototype)
    .on('getOffered', Actions.getOffered)
    .on('getThumb', Actions.getThumb)
    .on('hide', windowMethods.hide)
    .on('openPrototypeDialog', windowMethods.openPrototypeDialog)
    .on('closePrototype', windowMethods.closePrototype)
    .on('loadPrototype', (event, path) => loadPrototype(path))
