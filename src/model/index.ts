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
