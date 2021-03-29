import React from "react"
import classnames from "classnames"
import "./index.scss"

interface InputSwitchProps {
    checked?: boolean
    onChange?: Function
    className?: string
    hasLabel?: boolean
    disabled?: boolean
    textDisable?: string
    textEnable?: string
    uncontrolled?: boolean
}

interface InputSwitchStates {
    checked?: boolean
    disabled?: boolean
}
export class InputSwitch extends React.Component<
    InputSwitchProps,
    InputSwitchStates
> {
    constructor(props: InputSwitchProps) {
        super(props)
        let checked = this.props.checked ? this.props.checked : false
        this.state = {
            checked: checked
        }
    }

    static defaultProps = {
        checked: false,
        disabled: false,
        textDisable: "Deactive",
        textEnable: "Active",
        uncontrolled: false
    }

    static getDerivedStateFromProps(props, state) {
        if (props.checked !== state.checked && !props.uncontrolled) {
            return {
                checked: props.checked
            }
        }
        return null
    }

    public handleOnChangeChecked = () => {
        if (this.props.onChange != null) {
            this.props.onChange(!this.state.checked)
        }
        if (this.props.uncontrolled) {
            this.setState({
                checked: !this.state.checked,
                disabled: this.state.checked ? true : false
            })
        }
    }

    public render() {
        let {
            hasLabel,
            textDisable,
            textEnable,
            className,
            uncontrolled
        } = this.props
        let { checked } = this.state

        const classes = classnames({
            "input-switch": true,
            "input-switch-on": checked,
            "input-switch-off": !checked,
            disabled: uncontrolled ? false : this.props.disabled,
            [className]: className
        })

        return (
            <div className={classes}>
                <label>
                    <input
                        type="checkbox"
                        onChange={this.handleOnChangeChecked}
                        disabled={!uncontrolled && this.props.disabled}
                        defaultChecked={checked}
                        className="input-checkbox"
                    />
                    <i />
                    {hasLabel ? (
                        checked ? (
                            <span className="text-smaller text-no-bold ml10">
                                {textEnable}
                            </span>
                        ) : (
                            <span className="text-smaller text-no-bold ml10">
                                {textDisable}
                            </span>
                        )
                    ) : null}
                </label>
            </div>
        )
    }
}
