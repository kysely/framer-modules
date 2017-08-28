import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ModuleUnmanaged extends Component {
    static propTypes = {
        moduleName: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <li className='moduleUnmanaged'>
                <div className='unmanagedBadge'></div>
                <h2>{this.props.moduleName}</h2>
            </li>
        )
    }
}
