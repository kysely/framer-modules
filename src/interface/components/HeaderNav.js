import React, { Component } from 'react'
import PropTypes from 'prop-types'

import textLimit from '../textLimit'

export default class HeaderNav extends Component {
    static propTypes = {
        tabs: PropTypes.array.isRequired,
        tabSwitcher: PropTypes.func.isRequired,
        activeTab: PropTypes.number.isRequired,
        prototypePath: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props)
    }

    getPrototypeName(prototypePath) {
        return textLimit(prototypePath.replace(/.*\/|\.framer/g, ''), 14)
    }

    switchActive(index) {
        this.props.tabSwitcher(index)
    }

    render() {
        return (
            <section className='headerNav'>
                <h1>
                    { this.getPrototypeName(this.props.prototypePath) }
                    <button onClick={Action.closePrototype}><span>Prototype Menu</span></button>
                </h1>

                <nav>
                    {
                        this.props.tabs.map((item, i) => {
                            const className = i === this.props.activeTab ? 'active' : ''

                            return <button onClick={ () => this.switchActive(i) }
                                           className={ className }
                                           key={ i }>
                                    { item }
                                    </button>
                        })
                    }
                </nav>

                <aside>
                    <button onClick={ () => this.switchActive(3) }
                            className={this.props.activeTab === 3 ? 'active' : ''}>
                            <span>Publish Module</span>
                    </button>
                </aside>
            </section>
        )
    }
}
