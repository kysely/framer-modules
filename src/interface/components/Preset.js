import React, { Component } from 'react'
import PropTypes from 'prop-types'

import textLimit from '../textLimit'
import ActionButton from './ActionButton'

export default class Preset extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        indexSelected: PropTypes.number.isRequired,
        singlePreset: PropTypes.object.isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        switchSelected: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    modulesList(modules = []) {
        const modulesNames = []
        modules.forEach(module => {
            modulesNames.push(module.name)
        })

        return textLimit(modulesNames.join(', '), 90)
    }

    onClickHandler = () => this.props.switchSelected(this.props.index)

    resolveClassName = () => `preset ${this.props.indexSelected === this.props.index ? 'selected' : ''}`

    render() {
        return (
            <li onDoubleClick={this.props.actions.install} onClick={this.onClickHandler} className={this.resolveClassName()}>
                <div className='presetDetails'>
                    <h2>{textLimit(this.props.singlePreset.name, 35)}</h2>
                    <div className='includesBadge'></div>
                    <p>{this.modulesList(this.props.singlePreset.modules)}</p>
                </div>

                <div className='moduleActions'>
                    <ActionButton click={this.props.actions.install} label='Install' shortcut='return' icon='INSTALL' />
                    <ActionButton click={this.props.actions.edit} label='Edit' shortcut='⌘E' icon='PRESET' />
                    <ActionButton click={this.props.actions.remove} label='Delete' shortcut='⌘⌫' icon='REMOVE' />
                </div>
            </li>
        )
    }
}
