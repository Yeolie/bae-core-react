import React, { useCallback, useEffect, useRef } from "react"
import classnames from "classnames"
import Menu from "./Menu"
import { SelectTarget } from "./Target"
import { cloneDeep, uniqBy } from "lodash"

import "./index.scss"

function sleep(time): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time))
}

const noop = () => {}

const Svg = (p: any) => <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation" {...p} />

export const ChevronDown = () => (
    <Svg style={{ marginRight: -6 }}>
        <path
            d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </Svg>
)

const LoadingIcon = () => (
    <svg className="select-spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle className="circle" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
)

const SearchIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-search"
        {...props}
    >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
)

const Dropdown = ({ children, isOpen, target, disabled, onClose, className }) => {
    const refDropdown = useRef<HTMLDivElement>(null)

    const handleClickOutside = useCallback((event) => {
        if (!refDropdown?.current?.contains(event.target)) {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [handleClickOutside])

    return (
        <div className={className} ref={refDropdown}>
            {target}
            {isOpen && !disabled ? <Menu>{children}</Menu> : null}
        </div>
    )
}

export interface SelectOptions {
    label: string
    value: any
}

interface SelectProps {
    options?: SelectOptions[]
    value: any
    onChange?: Function
    disabled?: boolean
    className?: string
    placeholder?: string
    isSearchable?: boolean
    isMulti?: boolean
    getLabelAsync?: (value: string) => Promise<SelectOptions>
    optionsAsync?: (data: any, callback?: (data: SelectOptions[]) => void) => Promise<SelectOptions[] | void>
}

interface SelectState {
    isOpen: boolean
    searchText: string
    loading: boolean
    options: SelectOptions[]
    optionsCache: SelectOptions[]
}

class Select extends React.Component<SelectProps, SelectState> {
    constructor(props: SelectProps) {
        super(props)

        this.state = {
            isOpen: false,
            searchText: "",
            loading: false,
            options: this.props.options,
            optionsCache: [],
        }
    }

    static defaultProps = {
        onChange: noop,
        disabled: false,
        options: [],
        value: "",
        isSearchable: false,
        isMulti: false,
        optionsAsync: null,
        getLabelAsync: null,
    }

    private setOpen = (isOpen) => {
        this.setState({
            isOpen: isOpen,
        })
    }

    private handleSearch = async (e) => {
        const { isSearchable } = this.props

        const value = e.target.value
        this.setState({ searchText: value }, () => {
            if (isSearchable) {
                this.fetchApi(value)
            }
        })
    }

    private handleRemove = (data) => {
        const { onChange } = this.props
        onChange(data)
    }

    private handleChange = (data: SelectOptions) => {
        const { onChange, value, isMulti } = this.props

        if (isMulti) {
            let result = [...value, data.value]
            onChange(result)
        } else {
            onChange(data.value)
        }

        this.setOpen(false)
    }

    private fetchApi = async (search) => {
        const { optionsAsync } = this.props

        if (!optionsAsync) return

        this.setState({ loading: true })

        const optionsPromise = optionsAsync(search, (result) => {
            const data = result?.length > 0 ? result : []
            this.setState({ options: data, loading: false })
        })

        const [result] = await Promise.all([optionsPromise, sleep(1000)])

        if (result) {
            const data = result?.length > 0 ? result : []
            this.setState({ options: data })
        }

        this.setState({ loading: false })
    }

    private getLabel = async (value) => {
        const { getLabelAsync } = this.props
        const { options, optionsCache } = this.state
        const optionsCombined = uniqBy([...options, ...optionsCache], "value")

        let option = null
        if (value) {
            if (typeof value === "object") {
                option = optionsCombined?.find((item) => item.value === value.value && item.label === value.label)
            }
            option = optionsCombined?.find((item) => item.value === value)
        }

        if (!getLabelAsync) {
            return option?.label ?? ""
        } else {
            if (option?.label) {
                // Cache
                return option.label
            }
            const optionAsync = await getLabelAsync(value)

            if (!optionAsync?.label && !optionAsync?.value) {
                return null
            }
            // Cache
            let optionsCacheClone = cloneDeep(optionsCache)
            optionsCacheClone.push(optionAsync)
            this.setState({ optionsCache: optionsCacheClone })

            return optionAsync.label
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { isSearchable } = this.props
        const { isOpen } = this.state

        if (prevState.isOpen !== isOpen) {
            if (isSearchable && isOpen) {
                this.fetchApi("")
            } else if (!isOpen) {
                this.setState({ searchText: "" })
            }
        }
    }

    render() {
        const { className, isSearchable, value, disabled, isMulti, placeholder } = this.props
        const { isOpen, searchText, loading, options, optionsCache } = this.state
        const optionsCombined = uniqBy([...options, ...optionsCache], "value")

        const checkExistedValueMulti = (option: SelectOptions, value: any[], isMulti: boolean) => {
            if (!isMulti) return false

            return value.findIndex((item) => item === option.value) > -1
        }

        const optionsFilter = optionsCombined.filter((option) => {
            if (searchText) {
                let regex = new RegExp(searchText, "igm")
                return (
                    (regex.test(option.value) || regex.test(option.label)) &&
                    !checkExistedValueMulti(option, value, isMulti)
                )
            }
            return true && !checkExistedValueMulti(option, value, isMulti)
        })

        return (
            <Dropdown
                className={classnames("select-container", {
                    [className]: className,
                    focus: isOpen,
                    value: value,
                })}
                isOpen={isOpen}
                onClose={() => this.setOpen(false)}
                disabled={disabled}
                target={
                    <SelectTarget
                        value={value}
                        disabled={disabled}
                        placeholder={placeholder}
                        isMulti={isMulti}
                        searchText={searchText}
                        getLabel={this.getLabel}
                        setOpen={this.setOpen}
                        handleRemove={this.handleRemove}
                        handleSearch={this.handleSearch}
                    />
                }
            >
                {isSearchable && !isMulti && (
                    <div className="select-search-container">
                        <div className="search-icon">
                            <SearchIcon />
                        </div>
                        <input
                            className="select-search-input"
                            placeholder="Tìm kiếm"
                            value={searchText}
                            onChange={this.handleSearch}
                        />
                    </div>
                )}

                {loading ? (
                    <div className="text-center opacity-7 no-result-container">
                        <div className="no-result-icon">
                            <LoadingIcon />
                        </div>
                        <span className="no-result-text">Đang tìm kiếm</span>
                    </div>
                ) : (
                    <React.Fragment>
                        {optionsFilter?.length > 0 ? (
                            optionsFilter.map((optionItem, key) => (
                                <div
                                    title={optionItem.label}
                                    className={classnames("select-item", {
                                        selected: value === optionItem.value,
                                    })}
                                    key={key}
                                    onClick={() => this.handleChange(optionItem)}
                                >
                                    {optionItem.label}
                                </div>
                            ))
                        ) : (
                            <div className="text-center opacity-7 no-result-container">
                                <div className="no-result-icon">
                                    <SearchIcon />
                                </div>
                                <span className="no-result-text">Không có dữ liệu</span>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </Dropdown>
        )
    }
}

export default Select
