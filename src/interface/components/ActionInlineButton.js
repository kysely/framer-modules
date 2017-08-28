import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ActionInlineButton extends Component {
    static propTypes = {
        click: PropTypes.func.isRequired,
        shortcut: PropTypes.string,
        icon: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <button onClick={this.props.click} className={`actionInlineButton`}>
                <span className='short'>{this.props.shortcut ? this.props.shortcut : ''}</span>
                <div className={`icon ${this.props.icon}`}></div>
            </button>
        )
    }
}
