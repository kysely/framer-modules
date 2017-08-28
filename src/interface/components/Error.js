import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ActionInlineButton from './ActionInlineButton'

export default class Error extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
        message: PropTypes.string,
    }

    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.message === null) return null

        return (
            <aside className='error'>
                <ActionInlineButton click={this.props.close} icon='REMOVE' />
                <p>{this.props.message}</p>
            </aside>
        )
    }
}
