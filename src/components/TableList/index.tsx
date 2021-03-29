import React from "react"
import classnames from "classnames"
// import { ReactComponent as NoResultIcon } from "./NoSearchResult.svg"
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { Container, Col, Row } from "react-bootstrap"

import "./index.scss"

const BREAK_POINT_CHANGE_LOAD_LIST_MODE = 200

interface TableListProps {
    header: any
    data: any
    loading?: boolean
    headerClassName?: string
    bodyClassName?: string
    itemSize?: number
    maxItemShow?: number
    isLazyLoad?: boolean
}

export const TableList: React.FC<TableListProps> = (props) => {
    const { header: headerList, data: dataList, loading, headerClassName, bodyClassName, itemSize, maxItemShow, isLazyLoad } = props

    const lazyLoading = isLazyLoad && dataList.length > BREAK_POINT_CHANGE_LOAD_LIST_MODE
    
    return !loading ? (
        <div className="responsive-table">
            <div className="table-header">
                {headerList.map((element, index) => (
                    <div
                        className={classnames("table-col", element.align, {
                            center: element.center,
                            [headerClassName]: headerClassName,
                        })}
                        key={index}
                    >
                        {element.title}
                    </div>
                ))}
            </div>
            <div className="body-table" style={{ height: dataList.length > 0 ? maxItemShow * itemSize : "auto" }}>
                {dataList.length > 0 ? (
                    lazyLoading ? (
                        <AutoSizer >
                            {({ height, width }) => (
                                <List height={height} width={width} itemCount={dataList.length} itemSize={itemSize}>
                                    {({ index, style }) => {
                                        let elementData = dataList[index]
                                        return (
                                            <div style={style} >
                                                <TableItem
                                                    key={index}
                                                    error={elementData?.error ?? false}
                                                    item={elementData}
                                                    header={headerList}
                                                    bodyClassName={bodyClassName}
                                                />
                                            </div>
                                        )
                                    }}
                                </List>
                            )}
                        </AutoSizer>
                    ) : (
                        dataList.map((elementData, index) => (
                            <TableItem
                                key={index}
                                error={elementData?.error ?? false}
                                item={elementData}
                                header={headerList}
                                bodyClassName={bodyClassName}
                            />
                        ))
                    )
                ) : (
                    <div className="block-center block-column min-height-300">
                        {/* <NoResultIcon /> */}
                        <span className="text-bold text-16">Chưa có dữ liệu</span>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <React.Fragment>
            <div className="skeleton-box m-b-12 m-l-12 m-r-12" style={{ height: 38 }}></div>
            <Container fluid>
                <Row className="m-b-18">
                    <Col sm={3}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                    <Col sm={7}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                    <Col sm={2}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                </Row>
                <Row className="m-b-18">
                    <Col sm={3}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "70%" }} />
                    </Col>
                    <Col sm={7}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "70%" }} />
                    </Col>
                    <Col sm={2}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "90%" }} />
                    </Col>
                </Row>
                <Row className="m-b-18">
                    <Col sm={3}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "50%" }} />
                    </Col>
                    <Col sm={7}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "40%" }} />
                    </Col>
                    <Col sm={2}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "60%" }} />
                    </Col>
                </Row>
                <Row className="m-b-18">
                    <Col sm={3}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                    <Col sm={7}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "90%" }} />
                    </Col>
                    <Col sm={2}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                </Row>
                <Row className="m-b-18">
                    <Col sm={3}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "70%" }} />
                    </Col>
                    <Col sm={7}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "80%" }} />
                    </Col>
                    <Col sm={2}>
                        <div className="skeleton-box m-l-12" style={{ height: 16, width: "60%" }} />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

TableList.defaultProps = {
    itemSize: 48,
    maxItemShow: 10,
    isLazyLoad: false
}

interface TableItemProps {
    header: any
    item: any
    error: boolean
    bodyClassName?: string
}

const TableItem: React.FC<TableItemProps> = (props) => {
    const { header, item, error, bodyClassName } = props
    
    return (
        <div
            className={classnames("table-row", {
                error: error,
                [item?.rowClassName]: item?.rowClassName 
            })}
        >
            {header.map((elementHeader, index) => (
                <div
                    key={index}
                    className={classnames("table-col", elementHeader.align, {
                        center: elementHeader.center,
                        [bodyClassName]: bodyClassName,
                    })}
                    data-label={index}
                    onClick={elementHeader.isExistOnClick ? item.onClick : null}
                >
                    <span className={item.className ? item.className : ""}>
                        {!elementHeader.format
                            ? item[elementHeader.key]
                            : elementHeader.format(item[elementHeader.key])}
                    </span>
                </div>
            ))}
        </div>
    )
}
