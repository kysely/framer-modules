import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Module from './Module'
import ListEnd from './ListEnd'

export default class ModulesList extends Component {
    static propTypes = {
        modules: PropTypes.array.isRequired,
        indexSelected: PropTypes.number.isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        switchSelected: PropTypes.func.isRequired,
        isInstalled: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        const listEndMessage = this.props.modules.length === 0 ?
                                    'nothing to be seen here' :
                                    'that\'s all for this search'
        return (
            <ul>
                {
                    this.props.modules.map((singleModule, index) => {
                        return <Module
                                    actions={this.props.actions}
                                    switchSelected={this.props.switchSelected}
                                    index={index}
                                    indexSelected={this.props.indexSelected}
                                    singleModule={singleModule}
                                    isInstalled={this.props.isInstalled}
                                    key={index} />
                    })
                }
                <ListEnd message={listEndMessage} />
            </ul>
        )
    }
}
