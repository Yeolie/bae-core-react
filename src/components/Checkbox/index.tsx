import * as React from "react"
import classnames from "classnames"
import { ReactComponent as CheckIcon } from "./icon_check.svg"
import { ReactComponent as RadioIcon } from "./icon_radio.svg"

import "./index.scss"

interface CheckboxProps {
    value?: boolean
    className?: string
    onChange?: Function
    disabled?: boolean
    name?: string
    isCircle?: boolean
    uncontrolled?: boolean
}

interface CheckboxStates {
    checked?: boolean
}

export class Checkbox extends React.Component<CheckboxProps, CheckboxStates> {
    constructor(props: CheckboxProps) {
        super(props)

        this.state = {
            checked: this.props.value,
        }
    }

    static defaultProps = {
        uncontrolled: false,
        value: false,
        disabled: false,
        onChange: () => {}
    }

    private handleOnChange = (e) => {
        let checked = !this.state.checked
        let name = e.target.name

        this.setState({ checked: checked }, () => {
            this.props.onChange({
                name: name,
                checked: checked
            })
        })

        e.stopPropagation()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState.checked && !nextProps.uncontrolled) {
            return {
                checked: nextProps.value
            }
        }
        return null
    }

    public render() {
        const { checked } = this.state
        const { className, name, isCircle, disabled } = this.props

        const classes = classnames({
            "next-input-checkbox": true,
            [className]: className
        })
        const classShape = classnames({
            "next-checkbox--styled": true,
            "radius-cycle": isCircle
        })
        
        return (
            <div className={classes}>
                <input
                    className="next-checkbox"
                    type="checkbox"
                    name={name}
                    id={name}
                    checked={checked}
                    disabled={disabled}
                    onChange={this.handleOnChange}
                />
                <span className={classShape}>
                    {!checked ? "" : (isCircle ? <RadioIcon className="checkmark" /> : <CheckIcon className="checkmark" /> )}
                </span>
            </div>
        )
    }
}
