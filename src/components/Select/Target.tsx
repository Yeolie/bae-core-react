import React, { useEffect, useState } from "react"
import classnames from "classnames"
import { SelectOptions, ChevronDown } from "./index"
import { InputTag } from "./InputTag"

interface SelectTargetProps {
    isMulti: boolean
    value: any
    disabled: boolean
    placeholder: string
    setOpen: Function
    searchText: string
    handleSearch: (e: any) => void
    handleRemove: (e: any) => void
    getLabel: (value: string) => Promise<string>
}

export const SelectTarget: React.FC<SelectTargetProps> = (props) => {
    const { isMulti, value, getLabel, disabled, placeholder, setOpen, searchText, handleSearch, handleRemove } = props
    const [text, setText] = useState<string>("")
    const [dataTag, setDataTag] = useState<SelectOptions[]>([])

    useEffect(() => {
        const prepareData = async () => {
            if (!isMulti) {
                const option = await getLabel(value)
                setText(option)
            } else {
                const valueFormated = []
                for (let item of value) {
                    let label = await getLabel(item)

                    if (label) {
                        valueFormated.push({
                            label: label,
                            value: item,
                        })
                    }
                }
                setDataTag(valueFormated)
            }
        }

        prepareData()
    }, [isMulti, getLabel, value])

    return (
        <div
            className={classnames("input-select", {
                disabled: disabled,
            })}
            onClick={() => (!disabled ? setOpen(true) : undefined)}
        >
            {!isMulti ? (
                <span className="text-truncate">{text ? text : placeholder ? placeholder : "Chọn giá trị"}</span>
            ) : (
                <InputTag
                    data={dataTag}
                    isDisabled={disabled}
                    inputValue={searchText}
                    onChange={handleSearch}
                    onRemove={handleRemove}
                    placeholder={placeholder}
                />
            )}{" "}
            <ChevronDown />
        </div>
    )
}
