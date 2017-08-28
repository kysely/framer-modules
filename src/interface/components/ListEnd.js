import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class ListEnd extends Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <li className='listEnd'>
                <p>{this.props.message}</p>
            </li>
        )
    }
}
