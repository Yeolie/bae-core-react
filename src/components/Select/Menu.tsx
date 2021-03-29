import React from "react"
import { debounce } from "lodash"

interface MenuProps {}

interface MenuState {
    isBottom: boolean
    isShow: boolean
}

class Menu extends React.PureComponent<MenuProps, MenuState> {
    constructor(props) {
        super(props)

        this.state = {
            isBottom: false,
            isShow: false,
        }
    }

    private refMenu: HTMLDivElement = null

    private checkIsBottom = (el: HTMLDivElement) => {
        const { isBottom } = this.state
        const DropdownBoundingClientRect = el.getBoundingClientRect()

        let offsetTop = DropdownBoundingClientRect.top + window.scrollY

        if (!isBottom) offsetTop = offsetTop - (DropdownBoundingClientRect.height + 35 - 100)
        if (isBottom) offsetTop = offsetTop + 100

        let outerHeight = el.offsetHeight
        let windowInnerHeight = window.innerHeight
        let windowScrollTop = window.pageYOffset

        return offsetTop + outerHeight > windowInnerHeight + windowScrollTop
    }

    private handleScroll = debounce((e: Event) => {
        if (this?.refMenu) {
            if (this.checkIsBottom(this.refMenu)) {
                this.setState({
                    isBottom: true,
                    isShow: true,
                })
            } else {
                this.setState({
                    isBottom: false,
                    isShow: true,
                })
            }
        }
    }, 50)

    componentDidMount() {
        this.handleScroll(null)

        document.addEventListener("scroll", this.handleScroll)
        window.addEventListener("resize", this.handleScroll)
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.handleScroll)
        window.removeEventListener("resize", this.handleScroll)
    }

    render() {
        const { isBottom, isShow } = this.state
        const shadow = "hsla(218, 50%, 10%, 0.1)"
        const reverse = {
            top: "auto",
            bottom: "100%",
        }

        let style: React.CSSProperties = {
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
            marginTop: !isBottom ? 4 : 0,
            marginBottom: isBottom ? 4 : 0,
            position: "absolute",
            zIndex: 5,
            width: "100%",
            minWidth: 200,
            maxHeight: 300,
            overflow: "auto",
            paddingTop: 4,
            paddingBottom: 4,
            opacity: isShow ? "1" : "0",
        }

        if (isBottom) {
            style = { ...style, ...reverse }
        }

        return (
            <div ref={(component) => (this.refMenu = component)} style={style}>
                {this.props.children}
            </div>
        )
    }
}

export default Menu
