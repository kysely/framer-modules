import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ListEnd from './ListEnd'
import Preset from './Preset'

export default class PresetsList extends Component {
    static propTypes = {
        presets: PropTypes.array.isRequired,
        indexSelected: PropTypes.number.isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        switchSelected: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const listEndMessage = this.props.presets.length === 0 ?
                                    'go to a module and press ⌘S' :
                                    'that\'s all the presets'
        return (
            <ul>
                {
                    this.props.presets.map((singlePreset, index) => {
                        return <Preset
                                    switchSelected={ this.props.switchSelected }
                                    actions={ this.props.actions }
                                    index={index}
                                    indexSelected={this.props.indexSelected}
                                    singlePreset={singlePreset}
                                    key={index} />
                    })
                }
                <ListEnd message={listEndMessage} />
            </ul>
        )
    }
}
