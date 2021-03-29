import { cloneDeep } from "lodash"
import React, { useCallback } from "react"
import { SelectOptions } from "./index"

interface InputTagProps {
    data: SelectOptions[]
    onChange: (e: any) => void
    inputValue: string
    onRemove: (data: any[]) => void
    isDisabled?: boolean
    placeholder?: string
}

export const InputTag: React.FC<InputTagProps> = (props) => {
    const { data, onChange, inputValue, isDisabled, onRemove, placeholder } = props

    const handleRemoveItem = useCallback(
        (index: number) => {
            let dataClone = cloneDeep(data)
            dataClone.splice(index, 1)
            onRemove(dataClone.map((item) => item.value))
        },
        [data, onRemove]
    )

    return (
        <div className="input-select-tag">
            {data?.map((item, index) => (
                <div key={`${item}-${index}`} className="input-select-tag__item">
                    <span className="input-select-tag__item__content">{item.label}</span>
                    {!isDisabled && (
                        <span className="input-select-tag__item__remove" onClick={() => handleRemoveItem(index)}>
                            <svg
                                width={14}
                                height={14}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </span>
                    )}
                </div>
            ))}
            <input
                value={inputValue}
                className="input-select-tag__input"
                onChange={onChange}
                placeholder={placeholder ?? "Tìm kiếm"}
            />
        </div>
    )
}
