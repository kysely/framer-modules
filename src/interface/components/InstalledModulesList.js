import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Module from './Module'
import ModuleUnmanaged from './ModuleUnmanaged'
import ListEnd from './ListEnd'

export default class InstalledModulesList extends Component {
    static propTypes = {
        modules: PropTypes.array.isRequired,
        unmanaged: PropTypes.array.isRequired,
        indexSelected: PropTypes.number.isRequired,
        actions: PropTypes.objectOf(PropTypes.func).isRequired,
        switchSelected: PropTypes.func.isRequired,
        isInstalled: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const listEndMessage = this.props.modules.length === 0 ?
                                    'no modules installed' :
                                    'that\'s all there is in the prototype'
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
                {
                    this.props.unmanaged.map((unmanagedModule, index) => {
                        return <ModuleUnmanaged
                                    moduleName={unmanagedModule}
                                    key={unmanagedModule} />
                    })
                }
                <ListEnd message={listEndMessage} />
            </ul>
        )
    }
}
