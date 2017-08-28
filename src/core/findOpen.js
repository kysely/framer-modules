/* Shout out to Ray (https://github.com/RayPS) for the tip on reading the plist
   for currently open prototypes lookup */

import { dialog } from 'electron'
import { spawn } from 'child_process'
import { homedir } from 'os'
import config from './storage'

const findOpenProcess = (callback = () => {}) => {
    const windowsPlist = homedir() + '/Library/Saved\ Application\ State/com.motif.framer.savedState/windows.plist'

    const printPlist = spawn('plutil', ['-p', `"${windowsPlist}"`], {shell: true})

    printPlist.stdout.on('data', data => {
        const openPrototypes = data.toString().match(/\/\w.+\.framer(?!\.s)/g)
        const parsed = openPrototypes ? openPrototypes.map(path => path.replace('%20', '\ ')) : []
        const results = [...new Set(parsed)]

        config.set('offeredPrototypes', results)
        callback(results)
        return
    })

    const returnNone = err => {
        config.set('offeredPrototypes', [])
        callback([])

        dialog.showErrorBox(
            'Oops, couldn\'t check for open prototypes',
            err.toString())
        return
    }
    printPlist.stderr.on('data', returnNone)
    printPlist.on('error', returnNone)
}

const findOpen = (delay, callback) => {
    setTimeout(() => findOpenProcess(callback), delay)
}

export default findOpen
