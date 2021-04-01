import { api } from "../../config/config.dev"
import { ICategory, IProduct, IShop } from "../../model"
import { Fetch } from "../fetch"

export const getShopDetail = async (username: string, offset: number = null, limit: number = 20) => {
    try {
        let url = api.getShopDetail.url + "?username=" + username + "&limit=" + limit + "&offset=" + offset
        let response = await Fetch.Get<IShop[]>(url)
        if (response) {
            return response?.data
        }
    } catch (error) {
        console.log(error)
    }
}

export const getCategory = async (shop_id: number, offset: number = 0, limit: number = 20) => {
    try {
        let url = api.getCategory.url + "?shop_id=" + shop_id + "&limit=" + limit + "&offset=" + offset
        let response = await Fetch.Get<ICategory[]>(url)
        if (response) {
            return response.data
        }
    } catch (error) {
        console.log(error)
    }
}

export const getProducts = async (shop_id: number, category_id: number, offset: number = 0, limit: number = 100) => {
    try {
        let url =
            api.getProducts.url +
            "?shop_id=" +
            shop_id +
            "&cat_id=" +
            category_id +
            "&limit=" +
            limit +
            "&offset=" +
            offset
        let response = await Fetch.Get<IProduct[]>(url)
        if (response) {
            return response.data
        }
    } catch (error) {
        console.log(error)
    }
}
