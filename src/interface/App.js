import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'
import createButtonActions from './createButtonActions'
import filter from './filter'

import style from './sass/App.sass'

import Splash from './components/Splash'
import Header from './components/Header'
import LoadingIndicator from './components/LoadingIndicator'
import ModulesList from './components/ModulesList'
import PresetsList from './components/PresetsList'
import InstalledModulesList from './components/InstalledModulesList'
import Publish from './components/Publish'
import ModalWindow from './components/ModalWindow'
import Error from './components/Error'
import Notification from './components/Notification'

class App extends Component {
    state = {
        error: null,
        notification: null,
        isLoading: false,
        pendingScheme: null,

        modalWindow: null,
        openModal: false,

        prototypePath: Action.getPrototype(),

        activeTab: 0,
        tabsFields: ['', '', '', ''],
        indexesSelected: [0, 0, 0],

        unmanaged: [],
        installedUniques: [],
        tabsContents: [
            [],
            [],
            [],
            'IDLE'
        ]
    }

    constructor(props) {
        super(props)
        this.tabs = ['Add Module', 'Presets', 'Installed']

        this.placeholders = [
            'Search new modules...',
            'Filter your presets...',
            'Filter installed modules...',
            'Enter module\'s GitHub link...'
        ]

        this.queryChange = debounce((tabIndex) => this.queryActions[tabIndex](), 300)
    }

    componentDidMount() {
        this.switchPrototype()

        Action.updateOpen(newOne => {
            this.setState({ prototypePath: newOne }, this.switchPrototype)
        })

        Action.openURLScheme(query => {
            this.setState({ pendingScheme: query })
        })
    }

    componentDidUpdate() {
        if (this.state.pendingScheme && this.state.prototypePath) {
            this.switchTab(0)
            this.searchFieldChange({ target: {value: this.state.pendingScheme} }, 0)
            this.setState({pendingScheme: null})
        }
    }

    queryActions = [
        // ADD MODULE
        () => {
            this.startLoading()
            Action.search(this.state.tabsFields[0], (err, data) => {
                this.stopLoading()
                if (err) this.throwError(err)
                this.updateContents(0, data)
            })
        },
        // PRESETS
        () => {
            this.updatePresets(Action.getPresets())
        },
        // INSTALLED
        () => {
            this.updateInstalled()
        },
        // PUBLISH NEW
        () => {
            this.startLoading()
            Action.tryNew(this.state.tabsFields[3], (err, data) => {
                this.stopLoading()
                this.throwError(err)
                switch (data.status) {
                    case 'OK':
                        this.updatePublish('FETCH_OK')
                        break
                    case 'DUPL_OK':
                        this.updatePublish('FETCH_DUPL_OK')
                        break
                    case 'DUPL_DENY':
                        this.updatePublish('DENY')
                        break
                    default:
                        this.updatePublish('IDLE')
                }
            })
        },
    ]

    buttonActions = [
        // MODULES
        createButtonActions({
            install: (index) => {
                this.startLoading()
                this.getSelectedItem(index, selected => {
                    Action.install(selected, (err, data) => {
                        this.stopLoading()
                        if (err) this.throwError(err)
                        this.updateInstalled()
                    })
                })
            },
            snippet: (index) => {
                this.startLoading()
                this.getSelectedItem(index, selected => {
                    Action.copySnippet(selected, err => {
                        this.stopLoading()
                        if (err) return this.throwError(err)
                        this.throwNotification('Copied to clipboard!')
                    })
                })
            },
            preset: (index) => {
                const clickHandler = (boundTo, item) => {
                    this.updatePresets(Action.addToPreset([boundTo, item]))
                    this.closeModal()
                }
                this.getSelectedItem(index, selected => {
                    const { name, unique_name } = selected
                    const boundTo = {name, unique_name}
                    const presetsList = Action.getPresets()
                    const newModal = <ModalWindow
                                        bound={boundTo}
                                        input='Add to a new preset...'
                                        items={presetsList}
                                        buttonClick={clickHandler}
                                        buttonIcon='INSTALL'
                                        shortcut='Return'
                                        close={this.closeModal} />

                    this.setState({ openModal: true, modalWindow: newModal })
                })
            },
            github: (index) => {
                this.getSelectedItem(index, selected => {
                    const link = selected.github.indexOf('http') !== 0 ?
                        `http://${selected.github}` :
                        selected.github
                    Action.openLink(link)
                })
            },
            remove: (index) => {
                this.startLoading()
                this.getSelectedItem(index, selected => {
                    Action.remove(selected, (err, data) => {
                        this.stopLoading()
                        if (err) this.throwError(err)
                        this.updateInstalled()
                    })
                })
            }
        }),
        // PRESETS
        createButtonActions({
            install: (index) => {
                this.startLoading()
                this.getSelectedItem(index, selected => {
                    Action.installPreset(selected.name, (err, data) => {
                        this.stopLoading()
                        if (err) this.throwError(err)
                        this.updateInstalled()
                    })
                })
            },
            edit: (index) => {
                const clickHandler = (boundTo, item) => {
                    this.updatePresets(Action.editPreset([boundTo, item]))
                    this.closeModal()
                }
                this.getSelectedItem(index, selected => {
                    const {name: boundTo, modules: presetModules } = selected
                    const newModal = <ModalWindow
                                        bound={boundTo}
                                        items={presetModules}
                                        buttonClick={clickHandler}
                                        buttonLabel='⌘⌫'
                                        buttonIcon='REMOVE'
                                        shortcut='CmdBackspace'
                                        close={this.closeModal} />

                    this.setState({ openModal: true, modalWindow: newModal })
                })
            },
            remove: (index) => {
                this.getSelectedItem(index, selected => {
                    this.updatePresets( Action.deletePreset(selected.name) )
                })
            }
        }),
        // INSTALLED (mapped so the tab uses actions from index 0)
        {},
        // PUBLISH NEW
        createButtonActions({
            install: (index) => {
                this.queryActions[3]()
            }
        })
    ]

    switchPrototype() {
        if (this.state.prototypePath !== null) {
            this.updatePresets(Action.getPresets())
            this.updateInstalled()

            const prototypeName = this.state.prototypePath.replace(/.*\/|\.framer/g, '')
            this.throwNotification(`Switched to '${prototypeName}'`)
        }
    }

    getSelectedItem = (tabIndex, callback) => {
        if (typeof tabIndex !== 'number') tabIndex = this.state.activeTab
        const selected = this.state.tabsContents[tabIndex][this.state.indexesSelected[tabIndex]]
        if (selected) return callback(selected)
        return
    }

    updateContents = (tabIndex, contents) => {
        const newContents = this.state.tabsContents.slice()
        newContents[tabIndex] = contents
        this.setState({tabsContents: newContents}, () => {
            // Focus first item
            this.switchSelected(0, tabIndex)
        })
    }

    updatePresets = (newPresets) => {
        this.updateContents(1, filter(newPresets, this.state.tabsFields[1]))
    }

    updateInstalled = () => {
        Action.installed((err, data) => {
            if (err) this.throwError(err)
            this.updateContents(2, filter(data.recognized, this.state.tabsFields[2]))
            const newUniques = data.recognized.map(mod => mod.unique_name)
            this.setState({unmanaged: data.unknown, installedUniques: newUniques})
        })
    }

    updatePublish = newStatus => {
        this.updateContents(3, newStatus)
    }

    publish = () => {
        this.startLoading()
        Action.publishNew(this.state.tabsFields[3], (err, data) => {
            this.stopLoading()
            if (err) return this.throwError(err)
            this.updatePublish('SUCCESS')
        })
    }

    isInstalled = moduleUniqueName => {
        return this.state.installedUniques.includes(moduleUniqueName) ? true : false
    }

    startLoading = () => {
        this.setState({isLoading: true})
    }

    stopLoading = () => {
        this.setState({isLoading: false})
    }

    throwError = error => {
        this.setState({error})
    }

    closeError = () => {
        this.setState({error: null})
    }

    throwNotification = message => {
        this.setState({error: null, notification: message}, () => {
            setTimeout(() => {
                this.setState({notification: null})
            }, 3000)
        })
    }

    closeModal = () => {
        this.setState({modalWindow: null, openModal: false})
    }

    switchTab = index => {
        if (index === this.state.activeTab) return
        const newActiveTab = index > this.tabs.length ? 0 : index
        this.setState({ activeTab: newActiveTab })
    }

    scrollContent = (newIndex, oldIndex) => {
        const bottomOfSelected = (newIndex+1) * 110
        if (bottomOfSelected <= this.mainContent.scrollTop || bottomOfSelected > this.mainContent.scrollTop+350) {
            this.mainContent.scrollTop += 110 * (newIndex-oldIndex)
        }
    }

    switchSelected = (index, tab = this.state.activeTab) => {
        const newIndexes = this.state.indexesSelected.slice()
        const oldIndex = newIndexes[tab]
        const newIndex = index >= this.state.tabsContents[tab].length ?
                                this.state.tabsContents[tab].length-1 :
                                index < 0 ? 0 : index
        newIndexes[tab] = newIndex
        this.setState({indexesSelected: newIndexes})
        this.scrollContent(newIndex, oldIndex)
    }

    searchFieldChange = (e, tabIndex = this.state.activeTab) => {
        const newFields = Array.from(this.state.tabsFields)
        newFields[tabIndex] = e.target.value

        this.setState({ tabsFields: newFields }, () => this.queryChange(tabIndex))
    }

    keyboardNav = key => {
        const im = i => { // Index Mapping (so we use same actions on tab 0 and 2)
            const mapping = { 0:0, 1:1, 2:0, 3:3 }
            return mapping[i]
        }

        switch (key) {
            case 'ArrowUp':
            case 'ArrowDown':
                const direction = key === 'ArrowDown' ? 1 : -1
                this.switchSelected(this.state.indexesSelected[this.state.activeTab] + direction)
                break
            case 'Tab':
                const newActiveTab = this.state.activeTab + 1
                this.switchTab(newActiveTab >= this.tabs.length ? 0 : newActiveTab)
                break
            case 'Escape':
                Action.hide()
                break
            case 'Return':
                this.buttonActions[im(this.state.activeTab)].install(this.state.activeTab)
                break
            case 'CmdBackspace':
                this.buttonActions[im(this.state.activeTab)].remove(this.state.activeTab)
                break
            case 'CmdC':
                this.buttonActions[im(this.state.activeTab)].snippet(this.state.activeTab)
                break
            case 'CmdS':
                this.buttonActions[im(this.state.activeTab)].preset(this.state.activeTab)
                break
            case 'CmdG':
                this.buttonActions[im(this.state.activeTab)].github(this.state.activeTab)
                break
            case 'CmdE':
                this.buttonActions[im(this.state.activeTab)].edit(this.state.activeTab)
                break
            case 'CmdV':
                const newValue = this.state.tabsFields[this.state.activeTab] + Action.cmdV()
                this.searchFieldChange({ target: {value: newValue} })
        }
    }

    render() {
        if (this.state.prototypePath === null) {
            return(
                <div>
                    <Splash
                        prototypes={Action.getOffered()} />
                </div>
            )
        } else {
            return (
                <div>
                    <LoadingIndicator isLoading={this.state.isLoading} />
                    <Error close={this.closeError} message={this.state.error} />
                    <Notification message={this.state.notification} />
                    <Header
                        openModal={this.state.openModal}
                        prototypePath={this.state.prototypePath}
                        tabs={this.tabs}
                        activeTab={this.state.activeTab}
                        tabSwitcher={this.switchTab}
                        placeholder={this.placeholders[this.state.activeTab]}
                        value={this.state.tabsFields[this.state.activeTab]}
                        valueSwitcher={this.searchFieldChange}
                        keyboardNav={this.keyboardNav} />

                    <main ref={(el) => this.mainContent = el}>
                        {
                            [
                                <ModulesList
                                    indexSelected={this.state.indexesSelected[0]}
                                    actions={this.buttonActions[0]}
                                    switchSelected={this.switchSelected}
                                    modules={this.state.tabsContents[0]}
                                    isInstalled={this.isInstalled} />,
                                <PresetsList
                                    indexSelected={this.state.indexesSelected[1]}
                                    actions={this.buttonActions[1]}
                                    switchSelected={this.switchSelected}
                                    presets={this.state.tabsContents[1]} />,
                                <InstalledModulesList
                                    indexSelected={this.state.indexesSelected[2]}
                                    actions={this.buttonActions[0]}
                                    switchSelected={this.switchSelected}
                                    modules={this.state.tabsContents[2]}
                                    unmanaged={this.state.unmanaged}
                                    isInstalled={this.isInstalled} />,
                                <Publish
                                    status={this.state.tabsContents[3]}
                                    publish={this.publish} />
                            ][this.state.activeTab]
                        }
                    </main>

                    {this.state.modalWindow}
                </div>
            )
        }
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)
