import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ActionButton extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        click: PropTypes.func.isRequired,
        shortcut: PropTypes.string,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <button onClick={this.props.click} className='actionButton'>
                <div className={`icon ${this.props.icon}`}></div>
                <span className='label'>{this.props.label}</span>
                <span className='short'>{this.props.shortcut}</span>
            </button>
        )
    }
}
