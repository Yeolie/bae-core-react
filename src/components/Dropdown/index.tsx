import React from "react"
import classnames from "classnames"
import BaseDropdown from "react-overlays/Dropdown"

import { DropdownToggle } from "./DropdownToggle"
import { DropdownMenu } from "./DropdownMenu"
import { DropdownItem } from "./DropdownItem"

import "./index.scss"

interface IDropdownHeaderProps {
    as?: React.ReactType
    className?: string
}

const DropdownHeader: React.FC<IDropdownHeaderProps> = (props) => {
    const { children, className, as: Component } = props
    return (
        <Component
            {...props}
            className={classnames({
                "dropdown-header-custom": true,
                [className]: className,
            })}
        >
            {children}
        </Component>
    )
}

DropdownHeader.defaultProps = {
    as: "div",
}

interface IDropdownProps {
    show?: boolean
    onToggle?: Function
    drop?: string
    alignEnd?: boolean

    uncontrolled?: boolean
}

interface IDropdownStates {
    isShow?: boolean
}

export class Dropdown extends React.Component<IDropdownProps, IDropdownStates> {
    static DropdownToggle = DropdownToggle
    static DropdownMenu = DropdownMenu
    static DropdownItem = DropdownItem

    static DropdownHeader = DropdownHeader

    constructor(props) {
        super(props)
        this.state = {
            isShow: !this.props.uncontrolled ? this.props.show : false,
        }
    }

    toggleDropdown = (show) => {
        this.setState({
            isShow: !this.props.uncontrolled ? this.props.show : show,
        })
    }

    render() {
        const { children, show, onToggle, drop, alignEnd, uncontrolled } = this.props
        const { isShow } = this.state
        let showDropdown = show
        let toggleDropdown = onToggle
        if (uncontrolled) {
            showDropdown = isShow
            toggleDropdown = this.toggleDropdown
        }
        return (
            <BaseDropdown
                show={showDropdown}
                onToggle={toggleDropdown}
                drop={drop}
                alignEnd={alignEnd}
                itemSelector="button:not(:disabled)"
            >
                {({ props }) => (
                    <div {...props} className="dropdown-custom">
                        {children}
                    </div>
                )}
            </BaseDropdown>
        )
    }
}
