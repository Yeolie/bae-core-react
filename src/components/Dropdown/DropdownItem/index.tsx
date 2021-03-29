import * as React from 'react'
import classnames from 'classnames'
import './index.scss'

interface IDropdownItemProps {
    flip?: boolean
    className?: string
    disabled?: boolean
    onClick?: Function
    onClose?: Function
}

export const DropdownItem: React.FC<IDropdownItemProps> = props => {
    const { children, className, onClose, onClick, disabled } = props
    return (
        <div
            className={classnames({
                'dropdown-item-custom': true,
                disabled: disabled,
                [className]: className
            })}
            onClick={() => {
                onClick()
                onClose()
            }}>
            {children}
        </div>
    )
}

DropdownItem.defaultProps = {
    disabled: false,
    onClick: () => {},
    onClose: () => {}
}
