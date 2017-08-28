import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class PublishContent extends Component {
    static propTypes = {
        status: PropTypes.string.isRequired,
        publish: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.firstTimeLink = 'https://github.com/kysely/framer-modules/blob/master/PUBLISH.md'
    }

    openGuide = e => {
        e.preventDefault()
        Action.openLink(this.firstTimeLink)
    }

    getMessage = () => {
        switch (this.props.status) {
            case 'FETCH_OK':
                return ['Whooa, great! You can publish', 'Publish']
            case 'FETCH_DUPL_OK':
                return ['Always glad to see modules being updated', 'Update']
            case 'DENY':
                return ['Sorry, but this name is already taken', 'Sad emoji']
            case 'SUCCESS':
                return ['Thank you for your contribution', 'Sad emoji']
        }
    }

    getClickFunction = () => {
        if (this.props.status.includes('SUCCESS') || this.props.status.includes('DENY')) {
            return () => {}
        }
        return () => this.props.publish()
    }

    render() {
        if (this.props.status === 'IDLE') {
            return (
                <div id='firstTimePublishing'>
                    <h2>
                        First time publishing?<br />
                        <a onClick={this.openGuide} href={this.firstTimeLink}>
                            Read how to publish your module
                        </a>
                    </h2>
                </div>
            )
        } else {
            const [message, buttonLabel] = this.getMessage()
            return (
                <div className={`fetched ${this.props.status}`}>
                    <button onClick={this.getClickFunction()}><span>{buttonLabel}</span></button>
                    <h2>{message}</h2>
                </div>
            )
        }
    }
}
