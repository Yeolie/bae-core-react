import * as React from "react"
// import classnames from "classnames";
import BaseDropdownToggle from "react-overlays/DropdownToggle"
// import { useDropdownToggle } from "react-overlays"
import "./index.scss"

interface IDropdownToggleProps {
    id?: string
    className?: string
    disabled?: boolean
}

export const DropdownToggle: React.FC<IDropdownToggleProps> = props => {
    // const [props, { show, toggle }] = useDropdownToggle()
    const { children, id, className, disabled } = props

    return (
        <BaseDropdownToggle>
            {({ toggle, show, props }) => {
                return (
                    <div id={id} {...props} onClick={!disabled ? toggle : undefined} className={className}>
                        {children}
                    </div>
                )
            }}
        </BaseDropdownToggle>
    )
}
