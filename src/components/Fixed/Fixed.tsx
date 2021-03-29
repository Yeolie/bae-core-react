import React from 'react'
import classnames from 'classnames'
import VendorPrefix from 'react-vendor-prefix'

interface IFixed {
    style?: React.CSSProperties
    className?: string
}

export const Fixed: React.FC<IFixed> = props => {
    let className = props.className
    let classes = classnames('Fixed', { [className]: className })
    let style: React.CSSProperties = {
        position: 'relative'
    }

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
