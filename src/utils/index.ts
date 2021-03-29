import { v1 as uuidv1 } from "uuid"

export const setCookie = (cname: string, cvalue: any, exdays: number) => {
    let d = new Date()
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
    let expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

export const getCookie = (cname: string) => {
    let name = cname + "="
    let ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

export function formatNumber(number) {
    if (!number) {
        return 0
    }

    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const getItemLocalStorage = (key) => {
    return localStorage.getItem(key)
}

export const setItemLocalStorage = (key, value) => {
    localStorage.setItem(key, value)
}

export const removeItemLocalStorage = (key) => {
    localStorage.removeItem(key)
}

export const getParamFromURL = (key) => {
    const url = new URL(window.location.href)
    return url.searchParams.get(key)
}

export const setParamFromURL = (key, value) => {
    const query = insertParam(key, value)
    window.history.replaceState(null, null, `?${query}`)
}

export const removeParam = (key) => {
    let q = document.location.search.substr(1)

    let prefix = encodeURIComponent(key) + "="
    let pars = q.split(/[&;]/g)

    for (let i = pars.length; i-- > 0; ) {
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1)
        }
    }

    return pars.length > 0 ? pars.join("&") : ""
}

export const removeParamFromURL = (key) => {
    const query = removeParam(key)
    window.history.replaceState(null, null, `?${query}`)
}

export const insertParam = (key, value) => {
    key = encodeURI(key)
    value = encodeURI(value)

    let kvp = document.location.search.substr(1).split("&")

    let i = kvp.length
    let x
    while (i--) {
        x = kvp[i].split("=")

        if (x[0] === key) {
            x[1] = value
            kvp[i] = x.join("=")
            break
        }
    }

    if (i < 0) {
        kvp[kvp.length] = [key, value].join("=")
    }

    if (kvp.length === 2 && !kvp[0]) {
        return kvp[1]
    }

    return kvp.join("&")
}

export function updateQueryStringParameter(uri, key, value) {
    if (!value) return uri

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i")
    var separator = uri.indexOf("?") !== -1 ? "&" : "?"
    if (uri.match(re)) {
        return uri.replace(re, "$1" + key + "=" + value + "$2")
    } else {
        return uri + separator + key + "=" + value
    }
}

export const initDataLanguage = (languages = []) => {
    const initData = {
        code: "",
        languages: [],
    }

    languages.forEach((language) => {
        initData.languages.push({
            languageId: language.code,
            text: "",
        })
    })

    return initData
}

export const getUuid = () => {
    const deviceId = getItemLocalStorage("deviceId")
    if (!deviceId) {
        const uuid = uuidv1()
        setItemLocalStorage("deviceId", uuid)

        return uuid
    }

    return deviceId
}

export function sleep(time): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time))
}

// hh:mm
export function formatDate_hhmm(data: string | Date): string | Date {
    if (!data) {
        return ""
    }

    const date = new Date(data)

    if (date.toString() === "Invalid Date") {
        return ""
    }

    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()

    return hours + ":" + minutes
}
// DD/MM/yyyy
export function formatDate_ddmmyyyy(data: string | Date): string | Date {
    if (!data) {
        return ""
    }
    const date = new Date(data)

    if (date.toString() === "Invalid Date") {
        return ""
    }

    if (date.getTime() < 0) {
        return ""
    }

    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()

    return day + "/" + month + "/" + year
}

// weekday, DD/MM/yyyy
export function formatDate_weekdayddmmyyyy(data: string | Date): string | Date {
    if (!data) {
        return ""
    }
    const date = new Date(data)

    if (date.toString() === "Invalid Date") {
        return ""
    }

    const weekdayOptions = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]

    const weekday = weekdayOptions[date.getDay()]
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    const year = date.getFullYear()

    return `${weekday}, ${day}/${month}/${year}`
}

//
export function resetTimeDate(data: string | Date): string | Date {
    if (!data) {
        return ""
    }
    const date = new Date(data)

    if (date.toString() === "Invalid Date") {
        return ""
    }

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return new Date(year, month, day, 0, 0, 0, 0)
}

export function checkExsistKey(object, keys) {
    for (let key of keys) {
        if (object.hasOwnProperty(key)) {
            return true
        }
    }
    return false
}

export function nonAccentVietnamese(str) {
    str = str.toLowerCase()
    str = str.replace(
        /\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g,
        "a"
    )
    str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e")
    str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i")
    str = str.replace(
        /\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g,
        "o"
    )
    str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u")
    str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y")
    str = str.replace(/\u0111/g, "d")
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "") // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, "") // Â, Ê, Ă, Ơ, Ư
    return str
}

export function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

export function strippedStringHTML(data: string) {
    return data.replace(/(<([^>]+)>)/gi, "")
}

export function parseDate(input, format?) {
    format = format || "yyyy-mm-dd h:m:s z" // default format
    var parts = input.match(/((\d|\+)+)/g),
        i = 0,
        fmt = {}
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|mm|h|m|s|z)/g, function (part) {
        fmt[part] = i++
    })

    return new Date(
        `${parts[fmt["yyyy"]]}-${addZeroLowerTen(parts[fmt["mm"]])}-${addZeroLowerTen(
            parts[fmt["dd"]]
        )}T${addZeroLowerTen(parts[fmt["h"]])}:${addZeroLowerTen(parts[fmt["m"]])}:${addZeroLowerTen(
            parts[fmt["s"]]
        )}${formatTimezoneGTMtoUTC(parts[fmt["z"]])}`
    )
}

export function addZeroLowerTen(o) {
    let num = typeof o !== "number" ? parseInt(o) : o
    return num < 10 ? "0" + num : num
}

export function formatTimezoneGTMtoUTC(timezoneGTM: string) {
    let op = timezoneGTM.charAt(0)
    let timezone = parseInt(timezoneGTM.substr(1))
    let h = Math.round(timezone / 100)

    return `${op}${addZeroLowerTen(h) + ":" + addZeroLowerTen(timezone % 100)}`
}
