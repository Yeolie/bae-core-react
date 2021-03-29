import React from "react"
import ReactDOM from "react-dom"

interface DelayedPortalProps {
    isOpen: boolean
    openDelay?: number
    closeDelay?: number
    children?: any
}

interface DelayedPortalState {
    isOpen: boolean
    willChangeTo: string
}

/**
 * When `isOpen` is true, this component mounts its children in a
 * portal that is appended to the document's <body> tag.
 *
 * The component also keeps the children mounted for the specified
 * delay before and after, and passes in the current state so that
 * animated transitions can be implemented with CSS.
 */
export class DelayedPortal extends React.Component<DelayedPortalProps, DelayedPortalState> {
    constructor(props) {
        super(props)

        
        this.state = {
            // This lags the `isOpen` prop by the specified delays
            isOpen: false,
            willChangeTo: null,
        }
    }

    node = document.createElement("div")
    didChangeTimeout = null

    render() {
        // Don't render anything unless there is something to display
        if (!this.props.isOpen && !this.state.isOpen && !this.state.willChangeTo) {
            return null
        }

        return ReactDOM.createPortal(
            this.props.children({
                isOpen: this.state.isOpen,
                willOpen: this.state.willChangeTo === "open",
                willClose: this.state.willChangeTo === "closed",
            }),
            this.node
        )
    }

    componentDidMount() {
        document.body.appendChild(this.node)

        if (this.props.isOpen) {
            this.open()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.open()
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.close()
        }
    }

    open() {
        this.cancelQueue()

        // Force a reflow, so that a transition will be rendered
        // between the initial state, and the state that results
        // from setting `willChangeTo = "open"`.
        // this.node && this.node.scrollTop

        this.setState({
            willChangeTo: "open",
        })

        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: true,
                willChangeTo: null,
            })
            delete this.didChangeTimeout
        }, this.props.openDelay)
    }

    close() {
        this.cancelQueue()

        this.setState({
            willChangeTo: "closed",
        })

        this.didChangeTimeout = setTimeout(() => {
            this.setState({
                isOpen: false,
                willChangeTo: null,
            })
            delete this.didChangeTimeout
        }, this.props.closeDelay)
    }

    cancelQueue() {
        if (this.didChangeTimeout) {
            clearTimeout(this.didChangeTimeout)
            delete this.didChangeTimeout
        }
    }

    componentWillUnmount() {
        document.body.removeChild(this.node)
        delete this.node
        this.cancelQueue()
    }
}
