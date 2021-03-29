import React from "react"
import { ReactComponent as ScrollIcon } from "./scrolltotop.svg"
import classnames from "classnames"
import { debounce } from "lodash"
import { addButton, removeButton } from "../FloatingButtonContainer"

import "./index.scss"

interface ScrollToTopProps {
    scroll: Function
    offsetShow?: number
}

interface ScrollToTopStates {
    isShow: boolean
    id: string
}
export class ScrollToTop extends React.PureComponent<ScrollToTopProps, ScrollToTopStates> {
    constructor(props: ScrollToTopProps) {
        super(props)

        this.state = {
            isShow: false,
            id: ""
        }
    }

    static defaultProps = {
        offsetShow: 74,
    }

    private toggle = (isShow) => {
        this.setState({ isShow })
    }

    private handleScroll = debounce(() => {
        if (window.pageYOffset > this.props.offsetShow) {
            // this.toggle(true)
            const { id: currentId } = this.state

            if (!currentId) {
                let id = addButton(this.renderButton(), 999)
                this.setState({ id })
            }
        } else {
            const { id } = this.state
            this.setState({ id: "" })
            removeButton(id)
            
            // this.toggle(false)
        }
    }, 200)

    private renderButton = () => {
        return (
            <div className={classnames("scroll")} onClick={() => this.props.scroll()}>
                <div className="block-center scroll-icon">
                    <ScrollIcon />
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener("scroll", this.handleScroll)
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.handleScroll)
    }

    render() {
        return ""
        // const { isShow } = this.state

        // return (
        //     <div className={classnames("scroll", { show: isShow })} onClick={() => this.props.scroll()}>
        //         <div className="block-center scroll-icon">
        //             <ScrollIcon />
        //         </div>
        //     </div>
        // )
    }
}
