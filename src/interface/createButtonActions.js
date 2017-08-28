const DefaultActions = {
    install: () => {},
    snippet: () => {},
    preset: () => {},
    github: () => {},
    remove: () => {},
    edit: () => {},
}

const createButtonActions = (actions = {}) => {
    const newActions = Object.assign({}, DefaultActions)

    Object.keys(actions).forEach(key => {
        newActions[key] = actions[key]
    })

    return newActions
}

export default createButtonActions
