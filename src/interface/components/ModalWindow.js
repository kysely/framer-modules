import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ModalWindowItem from './ModalWindowItem'

export default class ModalWindow extends Component {
    static propTypes = {
        bound: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
        input: PropTypes.string,
        items: PropTypes.array.isRequired,
        buttonLabel: PropTypes.string,
        buttonClick: PropTypes.func.isRequired,
        buttonIcon: PropTypes.string.isRequired,
        close: PropTypes.func.isRequired,
        shortcut: PropTypes.string.isRequired,
    }

    state = {
        selectedIndex: 0,
        newItem: [],
        fieldValue: '',
    }

    constructor(props) {
        super(props)
        this.reservedKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Tab']
        this.viewThreshold = 5
    }

    componentDidMount() {
        this.modalWindow.focus()
        if (this.props.input) this.modalField.focus()
    }

    valueSwitcher = e => {
        const newItem = e.target.value.length === 0 ? [] : [{name: e.target.value}]

        this.setState({
            fieldValue: e.target.value,
            newItem: newItem,
            // Focus the custom item if changed
            selectedIndex: newItem.length === 0 ? this.state.selectedIndex : 0
        })
    }

    switchSelected = index => {
        this.setState({selectedIndex: index})
    }

    keyDown = e => {
        let keyRecognize = [
            { key: 'ArrowUp',       isPressed: e.key === 'ArrowUp' },
            { key: 'ArrowDown',     isPressed: e.key === 'ArrowDown' },
            { key: 'Return',        isPressed: e.key === 'Enter' },
            { key: 'CmdBackspace',  isPressed: e.key === 'Backspace' && e.metaKey },
        ]

        keyRecognize.forEach(option => {
            if (option.isPressed) {
                e.preventDefault()
                return this.keyboardNav(option.key)
            }
        })

        if (e.key === 'Escape') {
            this.props.close()
        }

        if ((e.key === 'a' || e.key === 'A') && e.metaKey) {
            this.modalField.select()
        }
    }

    keyboardNav = key => {
        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown':
                const direction = key === 'ArrowDown' ? 1 : -1
                const newIndex = this.state.selectedIndex + direction
                const newSelectedIndex = newIndex >= this.allItems().length ?
                                         this.allItems().length-1
                                         :
                                         newIndex < 0 ?
                                            0
                                            :
                                            newIndex

                if (newSelectedIndex >= this.viewThreshold) this.modalWindow.scrollTop += 40 * direction

                this.switchSelected(newSelectedIndex)
                break
            case 'Return':
                if (this.props.shortcut === 'Return') this.emitClick()
                break
            case 'CmdBackspace':
                if (this.props.shortcut === 'CmdBackspace') this.emitClick()
                break
        }
    }

    emitClick = () => {
        const clickedItem = this.allItems()[this.state.selectedIndex]
        if (clickedItem) this.props.buttonClick(this.props.bound, clickedItem.name)
    }

    allItems = () => this.state.newItem.concat(this.props.items)

    render() {
        return (
            <div className='modalOverlay'>
                <div tabIndex={0} ref={(div) => this.modalWindow = div} onKeyDown={this.keyDown} id='modalWindow'>
                    {
                        this.props.input
                        ?
                        <input type='text'
                            ref={(input) => this.modalField = input}
                            value={this.state.fieldValue}
                            onChange={this.valueSwitcher}
                            placeholder={this.props.input} />
                        :
                        null
                    }

                    <ul>
                        {
                            this.allItems().map((item, index) => {
                                return <ModalWindowItem
                                            key={index}
                                            index={index}
                                            indexSelected={this.state.selectedIndex}
                                            switchSelected={this.switchSelected}
                                            bound={this.props.bound}
                                            label={item.name}
                                            buttonClick={this.emitClick}
                                            buttonLabel={this.props.buttonLabel}
                                            buttonIcon={this.props.buttonIcon} />
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
