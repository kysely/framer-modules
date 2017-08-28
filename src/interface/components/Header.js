import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HeaderNav from './HeaderNav'

export default class Header extends Component {
    static propTypes = {
        openModal: PropTypes.bool.isRequired,
        prototypePath: PropTypes.string.isRequired,
        tabs: PropTypes.array.isRequired,
        tabSwitcher: PropTypes.func.isRequired,
        activeTab: PropTypes.number.isRequired,
        placeholder: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        valueSwitcher: PropTypes.func.isRequired,
        keyboardNav: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.searchField.focus()
    }

    componentDidUpdate() {
        this.searchField.focus()
    }

    onBlur = () => {
        if (!this.props.openModal) this.searchField.focus()
    }

    onKeyDown = e => {
        let keyRecognize = [
            { key: 'ArrowUp',       isPressed: e.key === 'ArrowUp' },
            { key: 'ArrowDown',     isPressed: e.key === 'ArrowDown' },
            { key: 'Tab',           isPressed: e.key === 'Tab' },
            { key: 'Return',        isPressed: e.key === 'Enter' },
            { key: 'Escape',        isPressed: e.key === 'Escape' },
            { key: 'CmdBackspace',  isPressed: e.key === 'Backspace' && e.metaKey },
            { key: 'CmdC',          isPressed: (e.key === 'c' || e.key === 'C') && e.metaKey },
            { key: 'CmdS',          isPressed: (e.key === 's' || e.key === 'S') && e.metaKey },
            { key: 'CmdG',          isPressed: (e.key === 'g' || e.key === 'G') && e.metaKey },
            { key: 'CmdE',          isPressed: (e.key === 'e' || e.key === 'E') && e.metaKey },
            { key: 'CmdV',          isPressed: (e.key === 'v' || e.key === 'V') && e.metaKey },
        ]

        keyRecognize.forEach(option => {
            if (option.isPressed) {
                e.preventDefault()
                return this.props.keyboardNav(option.key)
            }
        })

        if ((e.key === 'a' || e.key === 'A') && e.metaKey) {
            this.searchField.select()
        }
    }

    render() {
        return (
            <header>
                <HeaderNav
                    prototypePath={this.props.prototypePath}
                    tabs={this.props.tabs}
                    activeTab={this.props.activeTab}
                    tabSwitcher={this.props.tabSwitcher} />

                <input type='text'
                    ref={(input) => this.searchField = input}
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    onChange={this.props.valueSwitcher}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}  />
            </header>
        )
    }
}
