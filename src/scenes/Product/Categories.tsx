import classNames from "classnames"
import React, { useCallback, useEffect, useState } from "react"
import { ICategory } from "../../model"
import { getCategory } from "../../utils/apis/product"

interface CategoriesProps {
    selectedItem: ICategory
    changeItem: Function
    shopId: number
}

export const Categories: React.FC<CategoriesProps> = (props) => {
    const { selectedItem, changeItem, shopId } = props
    const [categories, setCategories] = useState<ICategory[]>([])

    const getCategories = useCallback(async (shop_id: number) => {
        let response = await getCategory(shop_id)
        if (response) setCategories(response.data)
    }, [])

    useEffect(() => {
        getCategories(shopId)
    }, [getCategories, shopId])
    
    return (
        <div>
            {categories?.map((item) => (
                <div
                    key={item.id}
                    className={classNames("categories-item", {
                        active: selectedItem?.id === item.id,
                    })}
                    onClick={() => changeItem(item)}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}
