import * as React from "react"
import { Modal as ModalLib } from "react-bootstrap"
import { ReactComponent as CloseModalIcon } from "./close-icon.svg"
import "./index.scss"

interface ModalProps {
    className?: string
    isOpen?: boolean
    onClose?: Function
    headerContent?: any
    bodyContent?: any
    footerContent?: any
    backdrop?: string | boolean
    isExistCloseIcon?: boolean
    ref?: React.Ref<any>
    size?: "sm" | "lg" | "xl"
    onSubmit?: (e: any) => Promise<void>
    centered?: boolean
}

interface ModalComponentProps extends ModalProps {
    innerRef?: React.Ref<any>
}

interface ModalStates {
    isOpen?: boolean
}

class ModalComponent extends React.Component<ModalComponentProps, ModalStates> {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    static defaultProps = {
        backdrop: true,
        isExistCloseIcon: true,
        size: "",
        onClose: () => { },
        onSubmit: () => { },
        centered: true
    }

    private onClose = () => {
        this.props.onClose(false)
    }

    public render() {
        const {
            isOpen,
            className,
            headerContent,
            bodyContent,
            footerContent,
            size,
            isExistCloseIcon,
            innerRef,
            centered
        } = this.props
        return (
            <ModalLib
                ref={innerRef}
                size={size}
                show={isOpen}
                onHide={this.onClose}
                className={className}
                centered={centered}
                onSubmit={e => this.props.onSubmit(e)}
            >
                {headerContent && (
                    <ModalLib.Header>
                        <ModalLib.Title>{headerContent}</ModalLib.Title>
                        {isExistCloseIcon && (
                            <button className="close" onClick={this.onClose}>
                                <CloseModalIcon style={{ fill: "#42526E" }} />
                            </button>
                        )}
                    </ModalLib.Header>
                )}
                {bodyContent && <ModalLib.Body>{bodyContent}</ModalLib.Body>}
                {footerContent && <ModalLib.Footer>{footerContent}</ModalLib.Footer>}
            </ModalLib>
        )
    }
}

const Modal: React.FC<ModalProps> = React.forwardRef((props, ref: React.Ref<any>) => (
    <ModalComponent {...props} innerRef={ref} />
))

export { Modal }
