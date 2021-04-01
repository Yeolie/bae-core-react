export interface IShop {
    username: string
    shopid: number
    shop_location: string
    name: string
    is_official_shop: boolean
    id: number
}

export interface ICategory {
    total_count: number
    shop_id: number
    shop_collection_id: number
    name: string
    id: number
}

export interface IProduct {
    status: number
    sold: number
    shopid: number
    price_before_discount: number
    price: number
    name: string
    itemid: number
    item_status: string
    image: string
    discount: string
}
