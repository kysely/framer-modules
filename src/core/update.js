import { dialog, shell, app } from 'electron'
import { autoUpdater } from 'electron-updater'

const downloadUpdate = () => shell.openExternal('https://github.com/kysely/framer-modules/releases/latest')

const checkForUpdates = () => {
    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdates()

    autoUpdater.on('update-available', update => {
        dialog.showMessageBox({
            message: `Good news!\nNew version of app is available! Do you want to download ${update.version}?`,
            buttons: ['Download Update', 'No, thanks'],
            defaultId: 0
        }, index => {
            if (index === 0) {
                downloadUpdate()
                app.quit()
            }
            return
        })

    })
}

export default checkForUpdates
