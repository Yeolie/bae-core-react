import { api } from "../../config/config.dev"
import { Fetch } from "../fetch"

export const getShopDetail = async (username: string, limit: number, offset: number) => {
    try {
        let url = api.getShopDetail.url + "?username=" + username + "&limit=" + limit + "&offset=" + offset
        let response = Fetch.Get(url)
        if (response) {
            return response
        }
    } catch (error) {
        console.log(error)
    }
}
