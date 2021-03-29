import React from "react"
import { enter, leave } from "el-transition"
import { DelayedPortal } from "./DelayedPortal"
import { ReactComponent as CloseIcon } from "./close.svg"

import "./index.scss"

interface ModalCustomProps {
    isOpen: boolean
    className?: string
    isExistCloseButton?: boolean
    isOuterAction?: boolean
    onClose?: () => void
}

interface ModalCustomState {}

class ModalCustom extends React.Component<ModalCustomProps, ModalCustomState> {
    constructor(props: ModalCustomProps) {
        super(props)

        this.state = {}
    }

    static defaultProps = {
        isOpen: false,
        isExistCloseButton: true,
        onClose: () => {},
        isOuterAction: true,
    }

    private refModalOverlay: HTMLDivElement
    private refModalPanel: HTMLDivElement
    private refModalClose: HTMLDivElement
    private mounted: boolean = false

    private openModal = () => {
        if (this.refModalOverlay) {
            enter(this.refModalOverlay)
        }

        if (this.refModalPanel) {
            enter(this.refModalPanel)
        }

        if (this.refModalClose) {
            enter(this.refModalClose)
        }
    }
    private closeModal = () => {
        if (this.refModalOverlay) {
            leave(this.refModalOverlay)
        }

        if (this.refModalPanel) {
            leave(this.refModalPanel)
        }

        if (this.refModalClose) {
            leave(this.refModalClose)
        }
    }

    private handleClickOutside = (e) => {
        if (this.props.isOuterAction) {
            if (this.refModalPanel && !this.refModalPanel.contains(e.target)) {
                this.props.onClose()
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isOpen !== this.props.isOpen) {
            if (this.props.isOpen) {
                this.openModal()
            } else {
                this.closeModal()
            }
        }
    }

    componentDidMount() {
        this.mounted = true
        document.addEventListener("mousedown", this.handleClickOutside)
    }

    componentWillUnmount() {
        this.mounted = false
        document.removeEventListener("mousedown", this.handleClickOutside)
    }

    render() {
        const { isOpen, isExistCloseButton, children, onClose } = this.props
        return (
            <DelayedPortal isOpen={isOpen} openDelay={300} closeDelay={200}>
                {(isOpen, willOpen, willClose) => (
                    <div className="modal-custom">
                        <div className="modal-custom-container">
                            <div
                                ref={(c) => (this.refModalOverlay = c)}
                                data-transition-enter="ease-out duration-300"
                                data-transition-enter-start="opacity-0"
                                data-transition-enter-end="opacity-100"
                                data-transition-leave="ease-in duration-200"
                                data-transition-leave-start="opacity-100"
                                data-transition-leave-end="opacity-0"
                                className="modal-custom-overlay"
                                aria-hidden="true"
                            >
                                <div className="modal-custom-overlay-item"></div>
                            </div>

                            <span className="modal-custom-hidden-item" aria-hidden="true">
                                &#8203;
                            </span>

                            <div
                                className="modal-custom-panel-container"
                                ref={(c) => (this.refModalPanel = c)}
                                data-transition-enter="transition-enter ease-out duration-300"
                                data-transition-enter-start="transition-enter-start"
                                data-transition-enter-end="transition-enter-end"
                                data-transition-leave="transition-leave ease-in duration-200"
                                data-transition-leave-start="transition-leave-start"
                                data-transition-leave-end="transition-leave-end"
                            >
                                {isExistCloseButton && (
                                    <div className="close-button" onClick={onClose}>
                                        <CloseIcon />
                                    </div>
                                )}
                                <div
                                    className="modal-custom-content-container"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby="modal-headline"
                                >
                                    <div className="modal-custom-content">{children}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DelayedPortal>
        )
    }
}

export default ModalCustom
