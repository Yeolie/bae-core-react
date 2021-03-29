import React from "react"
import classnames from "classnames"

// import { ReactComponent as SearchIcon } from "./magnifying-glass.svg"

import "./index.scss"
import { debounce } from "lodash"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

interface InputSearchProps {
    defaultValue?: string
    value?: string
    placeholder?: string
    onChange?: Function
    className?: string
    disabled?: boolean
    prefixIcon?: boolean
    debounce?: number
}

interface InputSearchStates {
    valueInput: string
}

export class InputSearch extends React.PureComponent<InputSearchProps, InputSearchStates> {
    constructor(props: InputSearchProps) {
        super(props)

        this.state = {
            valueInput: this.props.defaultValue ?? "",
        }
    }

    static defaultProps = {
        onChange: () => {},
        placeholder: "Enter value",
        disabled: false,
        prefixIcon: false,
        debounce: 500,
    }

    private handleSearch = debounce(async (searchText) => {
        this.props.onChange(searchText)
    }, this.props.debounce)

    private handleChange = (event) => {
        event.persist()

        this.setState({ valueInput: event.target.value }, () => {
            this.handleSearch(this.state.valueInput)
        })
    }

    private handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.handleSearch(this.state.valueInput)
        }
    }

    render() {
        const { placeholder, value, className, disabled, prefixIcon } = this.props
        const { valueInput } = this.state

        const classes = classnames("form-control search-input", { [className]: className })

        return (
            <div className={classnames("search-container", { "prefix-icon": prefixIcon, "suffix-icon": !prefixIcon })}>
                <input
                    placeholder={placeholder}
                    className={classes}
                    value={value ? value : valueInput}
                    onChange={this.handleChange}
                    disabled={disabled}
                    onKeyDown={this.handleKeyDown}
                />
                <FontAwesomeIcon className="search-icon" icon={faSearch} />
                {/* <SearchIcon style={{ fill: "#8492A6" }} className="search-icon" /> */}
            </div>
        )
    }
}
