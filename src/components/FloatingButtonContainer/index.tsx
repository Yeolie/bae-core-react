import React from "react"
import { eventManager } from "../../utils/eventManager"
import { BackgroundTaskAction } from "./action"
import { v1 as uuidv1 } from "uuid"

import "./index.scss"
import { cloneDeep, sortBy } from "lodash"

interface IItemButton {
    id: string
    item: React.ReactChild
    priority: number
}

interface FloatingButtonContainerProps {}

interface FloatingButtonContainerStates {
    loading: boolean
    listButton: IItemButton[]
}

export const addButton = (data, priority: number = -1) => {
    let id = uuidv1()
    eventManager.emit(BackgroundTaskAction.ADD_BUTTON, id, data, priority)

    return id
}

export const removeButton = (id: string) => {
    eventManager.emit(BackgroundTaskAction.REMOVE_BUTTON, id)
}

export const removeAllButton = () => {
    eventManager.emit(BackgroundTaskAction.REMOVE_ALL_BUTTON)
}

export class FloatingButtonContainer extends React.Component<
    FloatingButtonContainerProps,
    FloatingButtonContainerStates
> {
    constructor(props: FloatingButtonContainerProps) {
        super(props)

        this.state = {
            loading: false,
            listButton: [] as IItemButton[],
        }
    }

    private addButton = (id: string, data, priority: number) => {
        let { listButton } = this.state

        if (listButton.length >= 10) return null

        if (priority === -1) {
            priority = listButton.length
        }

        listButton.push({
            id: id,
            item: data,
            priority: priority,
        })

        this.setState({ listButton })

        return id
    }

    private removeButton = (id: string) => {
        if (!id) return
        let { listButton } = this.state
        let listButtonClone = cloneDeep(listButton)

        let indexDelete = listButtonClone.findIndex((item) => item.id === id)

        listButtonClone.splice(indexDelete, 1)

        this.setState({ listButton: listButtonClone })
    }

    private removeAllButton = () => {
        this.setState({ listButton: [] })
    }

    componentDidMount() {
        eventManager.emit(BackgroundTaskAction.DID_MOUNT)

        eventManager.on(BackgroundTaskAction.ADD_BUTTON, (id, data, priority) => {
            this.addButton(id, data, priority)
        })
        eventManager.on(BackgroundTaskAction.REMOVE_BUTTON, (id) => {
            this.removeButton(id)
        })
        eventManager.on(BackgroundTaskAction.REMOVE_ALL_BUTTON, () => {
            this.removeAllButton()
        })
    }

    componentWillUnmount() {
        eventManager.emit(BackgroundTaskAction.WILL_UNMOUNT)

        eventManager.off(BackgroundTaskAction.ADD_BUTTON)
        eventManager.off(BackgroundTaskAction.REMOVE_BUTTON)
    }

    render() {
        let { listButton } = this.state

        listButton = sortBy(listButton, "priority")?.reverse()

        return (
            <div className="floating-button">
                {listButton.map((data, index) => (
                    <div className="item-button m-t-20" key={index}>
                        {data.item}
                    </div>
                ))}
            </div>
        )
    }
}
