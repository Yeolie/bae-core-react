import classNames from "classnames"
import React from "react"
import { Container, Row, Col } from "react-bootstrap"
import { ICategory, IProduct, IShop } from "../../model"
import { getCategory, getProducts, getShopDetail } from "../../utils/apis/product"
import "./index.scss"

interface ProductProps {}

interface ProductState {
    selectedCategory: ICategory
    shopDetail: IShop
    categories: ICategory[]
    products: IProduct[]
}

class Product extends React.Component<ProductProps, ProductState> {
    constructor(props) {
        super(props)
        this.state = { categories: [], selectedCategory: {} as ICategory, shopDetail: {} as IShop, products: [] }
    }

    private changeMenu = (category: ICategory) => {
        this.setState({ selectedCategory: category })
        this.getProduct(category.shop_collection_id, category.shop_id)
    }

    private genImage = (imageId: string) => {
        return "https://cf.shopee.vn/file/" + imageId
    }

    private getProduct = async (categoryId: number, shopId: number) => {
        try {
            let response = await getProducts(shopId, categoryId)
            if (response) this.setState({ products: response })
        } catch (error) {}
    }

    private getCategories = async (shop_id: number) => {
        let response = await getCategory(shop_id)
        if (response) {
            await this.getProduct(response[0]?.shop_collection_id, shop_id)
            this.setState({ categories: response, selectedCategory: response[0] })
        }
    }

    private getShop = async (username: string, limit: number, offset: number) => {
        try {
            let response = await getShopDetail(username, limit, offset)
            if (response) {
                await this.getCategories(response[0]?.shopid)
                this.setState({ shopDetail: response[0] })
            }
        } catch (error) {}
    }

    componentDidMount() {
        this.getShop("apple_flagship_store", 10, 0)
    }

    render() {
        const { selectedCategory, categories, products } = this.state
        return (
            <div className="product-container">
                <Container fluid className="p-0 full-height">
                    <Row>
                        <Col sm={3}>
                            <div className="product-menu">
                                <div className="text-30">Shopee crawl</div>
                                <div className="m-t-20">
                                    {categories?.map((item) => (
                                        <div
                                            key={item.id}
                                            className={classNames("categories-item pointer", {
                                                active: selectedCategory?.id === item.id,
                                            })}
                                            onClick={() => this.changeMenu(item)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                        <Col sm={9}>
                            <div className="list-product block-center block-left block-wrap">
                                {products?.map((item, index) => (
                                    <div key={index} className="product">
                                        <div className="img-wrapper">
                                            <img src={this.genImage(item.image)} alt={item.name} />
                                        </div>
                                        <div className="name text-truncate">{item.name}</div>
                                        <div className="block-center-between">
                                            <div className={classNames({ "old-price": item.price })}>
                                                {item.price_before_discount / 1000000}
                                            </div>
                                            <div>{item.price / 1000000}</div>
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
