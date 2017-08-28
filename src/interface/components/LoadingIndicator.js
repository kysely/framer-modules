import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class LoadingIndicator extends Component {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={`loadingIndicator ${this.props.isLoading}`}>
                <div className='loadingPiece'></div>
            </div>
        )
    }
}
