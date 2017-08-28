import React, { Component } from 'react'
import PropTypes from 'prop-types'

import textLimit from '../textLimit'
import ActionInlineButton from './ActionInlineButton'

export default class ModalWindowItem extends Component {
    static propTypes = {
        bound: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
        index: PropTypes.number.isRequired,
        indexSelected: PropTypes.number.isRequired,
        switchSelected: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        buttonLabel: PropTypes.string,
        buttonClick: PropTypes.func.isRequired,
        buttonIcon: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)
    }

    resolveClassName = () => `modalItem ${this.props.indexSelected === this.props.index ? 'selected' : ''}`

    render() {
        return (
            <li onClick={ () => this.props.switchSelected(this.props.index) }
            className={this.resolveClassName()}>
                <span className='itemLabel'>{textLimit(this.props.label, 25)}</span>
                <ActionInlineButton
                    click={this.props.buttonClick}
                    shortcut={this.props.buttonLabel}
                    icon={this.props.buttonIcon} />
            </li>
        )
    }
}
