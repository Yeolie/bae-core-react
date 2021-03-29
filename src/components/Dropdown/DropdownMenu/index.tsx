import * as React from "react"
import classnames from "classnames"
// import BaseDropdownMenu from "react-overlays/DropdownMenu"
import { useDropdownMenu } from "react-overlays"
import "./index.scss"

interface IDropdownMenuProps {
    flip?: boolean
    className?: string
    popperConfig?: object
}

export const DropdownMenu: React.FC<IDropdownMenuProps> = props => {
    const { show, onClose, props: customProps } = useDropdownMenu({
        flip: props.flip,
        alignEnd: true,
        popperConfig: props.popperConfig
    })
    const { children, className } = props

    return (
        <div
            {...customProps}
            className={classnames({
                "dropdown-menu-custom": true,
                "dropdown-menu-custom--show": show,
                [className]: className
            })}
        >
            {React.Children.map(children, child => {
                let childNode = child as any
                if (childNode) {
                    return React.cloneElement(childNode, {
                        onClose: onClose
                    })
                }
            })}
        </div>
    )
}

DropdownMenu.defaultProps = {
    flip: true
}
