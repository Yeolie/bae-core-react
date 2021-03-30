import { api } from "../../config/config.dev"
import { ICategory, IShop } from "../../model"
import { Fetch } from "../fetch"

export const getShopDetail = async (username: string, offset: number = null, limit: number = 20) => {
    try {
        let url = api.getShopDetail.url + "?username=" + username + "&limit=" + limit + "&offset=" + offset
        let response = Fetch.Get<IShop[]>(url)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}

export const getCategory = async (shop_id: number, offset: number = null, limit: number = 20) => {
    try {
        let url = api.getCategory.url + "?shop_id=" + shop_id + "&limit=" + limit + "&offset=" + offset
        let response = Fetch.Get<ICategory[]>(url)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}
