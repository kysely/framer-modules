import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PublishContent from './PublishContent'

export default class Publish extends Component {
    static propTypes = {
        status: PropTypes.string.isRequired,
        publish: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return <PublishContent publish={this.props.publish} status={this.props.status} />
    }
}
