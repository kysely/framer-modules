import config from './storage'

const getPresets = () => config.get('presets')

const getUniques = presetName => {
    const thePreset = getPresets().filter(pr => pr.name === presetName)[0]
    return thePreset.modules.map(mod => mod.unique_name)
}

const isAlreadySaved = (uniqueName, modules) => {
    const alreadyThere = modules.filter(mod => mod.unique_name === uniqueName)
    return alreadyThere.length === 0 ? false : true
}

const deletePreset = presetName => {
    const updatedPresets = getPresets().filter(preset => preset.name !== presetName)
    config.set('presets', updatedPresets)
    return getPresets()
}

const addToPreset = action => {
    const [newModule, presetName] = action
    const presets = getPresets()

    if (presets.filter(pr => pr.name === presetName).length === 0) {
        presets.push({
            name: presetName,
            modules: [newModule]
        })
    } else {
        presets.forEach(pr => {
            if (pr.name === presetName) {
                if ( !isAlreadySaved(newModule.unique_name, pr.modules) ) {
                    pr.modules.push(newModule)
                }
            }
        })
    }

    config.set('presets', presets)
    return getPresets()
}

const editPreset = action => {
    const [presetName, deleteModule] = action
    let presets = getPresets()

    presets.forEach((pr, i) => {
        if (pr.name === presetName) {
            presets[i].modules = pr.modules.filter(mod => mod.name !== deleteModule)
            if (presets[i].modules.length === 0) {
                presets = deletePreset(presetName)
            }
        }
    })

    config.set('presets', presets)
    return getPresets()
}

export { getPresets, addToPreset, deletePreset, editPreset, getUniques }
