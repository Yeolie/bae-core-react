import React from "react"

import { Redirect, Route, Switch } from "react-router-dom"

import { connect } from "react-redux"
import { StateReducer } from "./store/root-reducer"
import Product from "./scenes/Product"

interface RoutesProps {}

class Routes extends React.PureComponent<RoutesProps, {}> {
    render() {
        return (
            <Switch>
                <Route exact name="Product" path="/product" component={Product} />
                <Redirect exact from="/" to="/product" />

                {/** Declare route above this line */}
            </Switch>
        )
    }
}

const mapStateToProps = (state: StateReducer) => {
    return {}
}

export default connect(mapStateToProps, null)(Routes)
