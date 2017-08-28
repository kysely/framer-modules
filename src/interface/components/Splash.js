import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SplashItem from './SplashItem'

export default class Splash extends Component {
    static propTypes = {
        prototypes: PropTypes.array.isRequired,
    }

    state = {
        selected: 0
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.splashWindow.focus()
    }

    openPrototype = index => {
        if (index === -1) return Action.openPrototypeDialog()

        Action.loadPrototype(this.props.prototypes[index])
    }

    switchSelected = index => {
        const newIndex = index >= this.props.prototypes.length ?
                            this.props.prototypes.length-1 :
                            index < 0 ? 0 : index
        this.setState({selected: newIndex})
    }

    onKeyDown = e => {
        let keyRecognize = [
            { key: 'ArrowUp',       isPressed: e.key === 'ArrowUp' },
            { key: 'ArrowDown',     isPressed: e.key === 'ArrowDown' },
            { key: 'Return',        isPressed: e.key === 'Enter' },
            { key: 'Tab',           isPressed: e.key === 'Tab' },
            { key: 'Escape',        isPressed: e.key === 'Escape' },
        ]

        keyRecognize.forEach(option => {
            if (option.isPressed) {
                e.preventDefault()
                return this.keyboardNav(option.key)
            }
        })
    }

    keyboardNav = key => {
        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown':
                const direction = key === 'ArrowDown' ? 1 : -1
                const newIndex = this.state.selected + direction
                this.switchSelected(newIndex)
                break
            case 'Return':
                this.openPrototype(this.state.selected)
                break
            case 'Escape':
                Action.hide()
                break
        }
    }

    render() {
        let splashContent
        if (this.props.prototypes.length === 0) {
            splashContent = <h2>There are no open prototypes in Framer.<br />If you want to manage a different prototype,<br />drag it onto the icon in menubar or press ⌘O</h2>
        } else {
            splashContent = (
                <ul>
                    <li className='splashItem'>
                        Choose one of open prototypes
                    </li>
                    {
                        this.props.prototypes.map((proto, index) => {
                            return <SplashItem
                                        key={index}
                                        index={index}
                                        selected={this.state.selected}
                                        path={proto}
                                        doubleclick={this.openPrototype}
                                        click={this.switchSelected} />
                        })
                    }
                </ul>
            )
        }
        return (
            <div onKeyDown={this.onKeyDown} tabIndex={0} ref={(div) => this.splashWindow = div} id='splashScreen'>
                { splashContent }
            </div>
        )
    }
}
