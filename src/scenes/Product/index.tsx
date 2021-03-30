import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { ICategory, IShop } from "../../model"
import { getShopDetail } from "../../utils/apis/product"
import { Categories } from "./Categories"
import "./index.scss"

interface ProductProps {}

interface ProductState {
    selectedMenu: ICategory
    shopDetail: IShop
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
        this.state = { selectedMenu: {} as ICategory, shopDetail: {} as IShop }
    }

    private changeMenu = (menu: ICategory) => {
        this.setState({ selectedMenu: menu })
    }

    private getProduct = (menu: string, listProduct: IProduct[]) => {
        if (menu === "all") return listProduct
        return listProduct.filter((el) => el.category === menu)
    }

    private getShop = async (username: string, limit: number, offset: number) => {
        try {
            let response = await getShopDetail(username, limit, offset)
            if (response) this.setState({ shopDetail: response?.data[0] })
        } catch (error) {}
    }

    componentDidMount() {
        this.getShop("apple_flagship_store", 10, 0)
    }

    render() {
        const { selectedMenu, shopDetail } = this.state
        return (
            <div className="product-container">
                <Container fluid className="p-0 full-height">
                    <Row>
                        <Col sm={3}>
                            <div className="product-menu">
                                <div className="text-30">Shopee crawl</div>
                                <div className="m-t-20">
                                    <Categories
                                        selectedItem={selectedMenu}
                                        shopId={shopDetail.id}
                                        changeItem={this.changeMenu}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className="p-20 block-center block-left">
                                {/* {this.getProduct(selectedMenu, fakeProduct)?.map((item, index) => (
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
                                ))} */}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Product
