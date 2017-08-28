import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SplashItem extends Component {
    static propTypes = {
        path: PropTypes.string.isRequired,
        selected: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
        doubleclick: PropTypes.func.isRequired,
        click: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
        this.pathRegex = /.*\//
    }

    resolveClassName = () => `splashItem ${this.props.selected === this.props.index ? 'selected' : ''}`

    render() {
        const path = this.props.path.match(this.pathRegex)[0]
        const prototypeName = this.props.path.replace(this.pathRegex, '')

        return (
            <li onDoubleClick={() => this.props.doubleclick(this.props.index)}
            className={this.resolveClassName()}
            onClick={() => this.props.click(this.props.index)}>
                <span>{path}</span>{prototypeName}
            </li>
        )
    }
}
