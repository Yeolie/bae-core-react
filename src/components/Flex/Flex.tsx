import React from "react"
import classnames from "classnames"
import VendorPrefix from "react-vendor-prefix"

interface IFlex {
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode
}

export const Flex = React.forwardRef((props: IFlex, ref?: React.Ref<HTMLDivElement>) => {
    let className = props.className
    let classes = classnames("Flex", { [className]: className })
    let style: React.CSSProperties = {
        flex: 1,
        position: "relative"
    }

    if (props.style) {
        style = { ...style, ...props.style }
    }

    style = VendorPrefix.prefix({ style }).style

    return (
        <div className={classes} style={style} ref={ref}>
            {props.children}
        </div>
    )
})
