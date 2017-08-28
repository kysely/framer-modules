import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Notification extends Component {
    static propTypes = {
        message: PropTypes.string,
    }

    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.message === null) return null

        return (
            <aside className='notification'>
                <p>{this.props.message}</p>
            </aside>
        )
    }
}
