import React from "react"
import classnames from "classnames"

function formatNumber(number: string): string {
    if (!number) return ""

    let parts = number.replace(/(?:!^)\D+/g, "").split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return parts.join(".")
}

interface InputNumberFormatProps {
    defaultValue?: number
    onChange?: Function
    onKeyDown?: Function
    onBlur?: Function
    onFocus?: Function
    className?: string
    style?: React.CSSProperties
    max?: number
    disabled?: boolean
    onError?: Function
    allowNegative?: boolean
    value?: number
    placeholder?: string
    autoFocus?: boolean
}

interface InputNumberFormatStates {
    inputValue?: string
    isError?: boolean
}

export class InputNumberFormat extends React.Component<InputNumberFormatProps, InputNumberFormatStates> {
    constructor(props: InputNumberFormatProps) {
        super(props)

        let value = this.props?.defaultValue?.toString() ?? ""
        this.state = {
            inputValue: formatNumber(value),
            isError: false,
        }
    }

    static defaultProps = {
        onChange: () => {},
        onKeyDown: () => {},
        onError: () => {},
        disabled: false,
        defaultValue: "",
        allowNegative: false,
        placeholder: "Nhập giá trị",
    }

    private inputRef: HTMLInputElement = null

    private checkOrGetMax = (value) => {
        const { max } = this.props
        let valueInt = !isNaN(parseInt(value)) ? parseInt(value) : 0
        if (max < valueInt) {
            valueInt = max
        }
        let valueFormated = valueInt.toString()
        if (valueInt === 0) {
            valueFormated = ""
        }

        return valueFormated
    }

    private handleChange = (e) => {
        const { value } = e.target
        const { allowNegative } = this.props

        let valueFormated = value
        if (allowNegative) {
            valueFormated = value.replace(/[?^!-]{0,1}[\D]+/g, "")
        } else {
            valueFormated = value.replace(/[\D]+/g, "")
        }

        valueFormated = this.checkOrGetMax(valueFormated)

        this.setState({ inputValue: valueFormated }, () => {
            const { inputValue } = this.state
            const value = parseInt(inputValue) ? parseInt(inputValue) : 0
            this.props.onChange(value)
        })
    }

    private handleKeyDown = (e) => {
        this.props.onKeyDown(e)
    }

    private handleFocus = (e) => {
        const { allowNegative } = this.props
        const { inputValue } = this.state
        let valueFormated = inputValue
        if (allowNegative) {
            valueFormated = inputValue.replace(/[?^!-]{0,1}[\D]+/g, "")
        } else {
            valueFormated = inputValue.replace(/[\D]+/g, "")
        }
        this.setState({ inputValue: valueFormated })
    }

    private handleBlur = (e) => {
        const { inputValue } = this.state
        let valueFormated = formatNumber(inputValue)
        this.setState({ inputValue: valueFormated })
    }

    componentDidUpdate(prevProps) {
        const { inputValue } = this.state

        const prevValue = prevProps?.value ?? 0
        const value = this.props?.value ?? 0

        if (value) {
            if (prevValue !== value && parseInt(inputValue) !== value) {
                this.setState({
                    inputValue: formatNumber(value?.toString()),
                })
            }
        }
    }

    componentDidMount() {
        if (this.inputRef && this.props.autoFocus) {
            this.inputRef.focus()
        }
    }

    render() {
        const { className, style, disabled, placeholder } = this.props
        const { inputValue } = this.state

        const inputClasses = classnames("input-number", {
            [className]: className,
        })

        return (
            <input
                type="text"
                value={inputValue}
                ref={(c) => (this.inputRef = c)}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
                style={style}
            />
        )
    }
}
