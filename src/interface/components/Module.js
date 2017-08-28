import React, { Component } from 'react'
import PropTypes from 'prop-types'

import textLimit from '../textLimit'
import ActionButton from './ActionButton'

export default class Module extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        indexSelected: PropTypes.number.isRequired,
        singleModule: PropTypes.object.isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        switchSelected: PropTypes.func.isRequired,
        isInstalled: PropTypes.func.isRequired
    }
    
    constructor(props) {
        super(props)
    }

    onClickHandler = () => this.props.switchSelected(this.props.index)

    resolveClassName = () => `module ${this.props.indexSelected === this.props.index ? 'selected' : ''}`

    resolveThumbnail = () => {
        if (typeof this.props.singleModule.thumb !== 'string') return

        const url = Action.getThumb(this.props.singleModule)
        const fileType = url.replace(/^.+\./, '')

        switch (fileType) {
            case 'mov':
            case 'mp4':
                return <video autoPlay loop src={url}></video>
                break
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <img src={url} alt='Module Thumbnail' />
                break
        }
    }

    render() {
        const isThisInstalled = this.props.isInstalled(this.props.singleModule.unique_name)
        return (
            <li onDoubleClick={this.props.actions.install} onClick={this.onClickHandler} className={this.resolveClassName()}>
                <div className='moduleThumbnail'>
                    { this.resolveThumbnail() }
                </div>

                <div className='moduleDetails'>
                    <h2>{textLimit(this.props.singleModule.name, 35)} <span>by {this.props.singleModule.author}</span></h2>
                    <p>{this.props.singleModule.description}</p>
                </div>

                <div className='moduleActions'>
                    {
                        isThisInstalled ?
                        <ActionButton click={this.props.actions.remove} label='Remove' shortcut='⌘⌫' icon='REMOVE' />
                        :
                        <ActionButton click={this.props.actions.install} label='Install' shortcut='return' icon='INSTALL' />
                    }
                    <ActionButton click={this.props.actions.snippet} label='Snippet' shortcut='⌘C' icon='SNIPPET' />
                    <ActionButton click={this.props.actions.preset} label='Preset' shortcut='⌘S' icon='PRESET' />
                    <ActionButton click={this.props.actions.github} label='GitHub' shortcut='⌘G' icon='GITHUB' />
                </div>

                {this.props.isInstalled(this.props.singleModule.unique_name) ? <div className='installedBadge'></div> : null}
            </li>
        )
    }
}
