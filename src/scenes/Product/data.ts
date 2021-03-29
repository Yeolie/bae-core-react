import { IProduct } from "."

const menu = [
    { label: "Tất cả sản phẩm", value: "all" },
    { label: "Phụ kiện Apple", value: "accessary" },
    { label: "Iphone", value: "iphone" },
    { label: "Macbook", value: "macbook" },
    { label: "Apple watch", value: "apple_watch" },
    { label: "AirPods", value: "air_pods" },
]

const fakeProduct: IProduct[] = [
    {
        id: "1",
        name: "Iphone 5",
        src:
            "data:image/jpeg;base64,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",
        category: "iphone",
        price: 5000000,
        sale_price: 3500000,
    },
    {
        id: "2",
        name: "Iphone 10",
        src:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Fxn4HOXTCvmVUFWAqkB0kkj2XEBb_MfaVJp7IlVoPr-EhvBdX3uCpoxMjvHdcm0-Y7_W5gOt&usqp=CAc",
        category: "iphone",
        price: 23000000,
    },
    {
        id: "3",
        name: "Macbook Pro M1",
        src:
            "data:image/jpeg;base64,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",
        category: "macbook",
        price: 31000000,
        sale_price: 30500000,
    },
]
export { menu, fakeProduct }