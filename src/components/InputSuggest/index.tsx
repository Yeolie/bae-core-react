import React from "react"
import classnames from "classnames"

import "./index.scss"

export interface IOptionSuggest {
    label: string
    action: string
}
interface InputSuggestProps {
    defaultValue?: string
    value?: string
    options: Array<IOptionSuggest>
    onChange?: Function
    isShowDropdown?: boolean
    min?: number
    max?: number
    className?: string
    placeholder?: string
    renderOption?: Function
    getOptionLabel?: Function
    prefixIcon?: React.ReactChild
    suffixIcon?: React.ReactChild
    autoFocus?: boolean
    skipValidate?: boolean
    dropdownHeight?: number
    disabled?: boolean
    onkeyUp?: boolean
    onClick?: Function
}

interface InputSuggestStates {
    valueInput: string
    isToggleInputSuggest: boolean
}

export class InputSuggest extends React.PureComponent<InputSuggestProps, InputSuggestStates> {
    constructor(props: InputSuggestProps) {
        super(props)

        this.state = {
            valueInput: this.props.value
                ? validateValue(this.props.value, this.props.max, this.props.skipValidate)
                : validateValue(this.props.defaultValue, this.props.max, this.props.skipValidate),
            isToggleInputSuggest: false,
        }
    }

    static defaultProps = {
        defaultValue: "",
        placeholder: "Nhập nội dung...",
        min: 0,
        max: 500,
        onChange: () => {},
        onClick: () => {},
        autoFocus: false,
        disabled: false,
        onkeyUp: true,
    }

    private refInput: HTMLInputElement = null
    private refItems: HTMLDivElement = null

    private onClick = (value, option) => {
        this.toggleInputSuggest(false)

        this.props.onChange(value, option, true)
    }

    private toggleInputSuggest = (show) => {
        this.setState({ isToggleInputSuggest: show })
    }

    private onChange = (e) => {
        const value = e.target.value

        if (this.props.isShowDropdown) {
            if (value !== "") this.toggleInputSuggest(true)
            else this.toggleInputSuggest(false)
        }

        this.props.onChange(
            validateValue(value, this.props.max, this.props.skipValidate),
            this.props?.options?.[0]?.action ?? "",
            false
        )
    }

    private onFocus = () => {
        if (this.state?.valueInput !== "") {
            if (this.props.isShowDropdown) {
                this.toggleInputSuggest(true)
            }
        }
    }

    private onKeyUp = (event) => {
        if (event.keyCode === 13 && this.props.onkeyUp) {
            this.toggleInputSuggest(false)

            this.props.onChange(this.state.valueInput, this.props?.options?.[0]?.action ?? "", true)
        }
    }

    private handleClickOutside = (event) => {
        if (
            this.refInput &&
            !this.refInput.contains(event.target) &&
            this.refItems &&
            !this.refItems.contains(event.target)
        ) {
            this.toggleInputSuggest(false)
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.value !== state.valueInput) {
            return {
                valueInput: validateValue(props.value, props.max, props.skipValidate),
            }
        }

        return null
    }

    componentDidMount() {
        const { autoFocus } = this.props

        if (this.refInput && autoFocus) {
            this.refInput.focus()
        }

        document.addEventListener("mousedown", this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside)
    }

    render() {
        const { valueInput, isToggleInputSuggest } = this.state
        const {
            options,
            isShowDropdown,
            min,
            max,
            className,
            placeholder,
            renderOption,
            getOptionLabel,
            prefixIcon,
            suffixIcon,
            dropdownHeight,
            disabled,
            onClick
        } = this.props

        return (
            <React.Fragment>
                <div
                    className={classnames("input-suggest", {
                        "prefix-icon": prefixIcon,
                        "suffix-icon": suffixIcon,
                    })}
                    onClick={(e) => onClick(e)}
                >
                    {prefixIcon && <span className="input-icon-prefix">{prefixIcon}</span>}
                    <input
                        className={classnames("search-input form-control", {
                            [className]: className,
                        })}
                        ref={(component) => (this.refInput = component)}
                        name="search"
                        placeholder={placeholder}
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        onKeyUp={this.onKeyUp}
                        value={valueInput}
                        minLength={min}
                        maxLength={max}
                        disabled={disabled}
                    />
                    {suffixIcon && <span className="input-icon-suffix">{suffixIcon}</span>}
                    {isShowDropdown && isToggleInputSuggest && (
                        <div
                            className={classnames(
                                "input-suggest-dropdown-items",
                                dropdownHeight && `max-height-${dropdownHeight}`
                            )}
                            ref={(component) => (this.refItems = component)}
                        >
                            {options?.map((option, index) => {
                                if (renderOption && typeof renderOption === "function") {
                                    return <React.Fragment key={index}>{renderOption(option)}</React.Fragment>
                                } else if (getOptionLabel && typeof getOptionLabel === "function") {
                                    return (
                                        <div
                                            className="input-suggest-dropdown-item pointer"
                                            key={index}
                                            onClick={() => this.onClick(valueInput, option)}
                                        >
                                            {getOptionLabel(option)}
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                    )}
                </div>
                
            </React.Fragment>
        )
    }
}

function validateValue(valueInput: string, max, skipValidate?: boolean) {
    if (!valueInput || skipValidate) return valueInput

    return valueInput?.trim()?.slice(0, max) ?? ""
}
