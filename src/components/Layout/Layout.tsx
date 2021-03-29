import React from "react"
import classnames from "classnames"
import VendorPrefix from "react-vendor-prefix"

interface ILayoutProps {
    style?: React.CSSProperties
    className?: string
    type: string
    isAbsolute?: boolean
}

export const Layout: React.FC<ILayoutProps> = (props) => {
    let className = props.className
    let classes = classnames("Layout", { [className]: className })
    let style: React.CSSProperties = {
        display: "flex",
        flex: 1,
        height: "100vh",
    }

    if (props.isAbsolute) {
        style = { ...style, ...{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 } }
    }

    style.flexDirection = props.type === "column" ? "column" : "row"

    if (props.style) {
        style = { ...style, ...props.style }
    }

    style = VendorPrefix.prefix({ style }).style

    return (
        <div className={classes} style={style}>
            {props.children}
        </div>
    )
}

Layout.defaultProps = {
    type: "row",
    isAbsolute: true,
}
