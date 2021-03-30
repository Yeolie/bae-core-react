import classNames from "classnames"
import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { getShopDetail } from "../../utils/apis/product"
import { fakeProduct, menu } from "./data"
import "./index.scss"

interface ProductProps {}

interface ProductState {
    selectedMenu: string
}

export interface IProduct {
    id: string
    name: string
    src: string
    category: string
    price: number
    sale_price?: number
}

class Product extends React.Component<ProductProps, ProductState> {
    constructor(props) {
        super(props)
        this.state = { selectedMenu: "all" }
    }

    private changeMenu = (menu: string) => {
        this.setState({ selectedMenu: menu })
    }

    private getProduct = (menu: string, listProduct: IProduct[]) => {
        if (menu === "all") return listProduct
        return listProduct.filter((el) => el.category === menu)
    }

    private getShop = async (username: string, limit: number, offset: number) => {
        try {
            let response = await getShopDetail(username, limit, offset)
            if (response) console.log(response)
        } catch (error) {}
    }

    componentDidMount() {
        this.getShop("apple_flagship_store", 10, 0)
    }

    render() {
        const { selectedMenu } = this.state
        return (
            <div className="product-container">
                <Container fluid className="p-0 full-height">
                    <Row>
                        <Col sm={3}>
                            <div className="product-menu">
                                <div className="text-30">Shopee crawl</div>
                                <div className="m-t-20">
                                    {menu?.map((item) => (
                                        <div
                                            key={item.value}
                                            className={classNames("menu-item", {
                                                active: selectedMenu === item.value,
                                            })}
                                            onClick={() => this.changeMenu(item.value)}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className="p-20 block-center block-left">
                                {this.getProduct(selectedMenu, fakeProduct)?.map((item, index) => (
                                    <div key={index} className="product">
                                        <div className="img-wrapper">
                                            <img src={item.src} alt={item.name} />
                                        </div>
                                        <div className="name">{item.name}</div>
                                        <div className="block-center-between">
                                            <div className={classNames({ "old-price": item.sale_price })}>
                                                {item.price}
                                            </div>
                                            <div>{item.sale_price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Product
