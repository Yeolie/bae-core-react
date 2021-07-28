import React from "react"

import { Redirect, Route, Switch } from "react-router-dom"

import { connect } from "react-redux"
import { StateReducer } from "./store/root-reducer"
import TradeCoin from "./scenes/TradeCoin"

interface RoutesProps {}

class Routes extends React.PureComponent<RoutesProps, {}> {
    render() {
        return (
            <Switch>
                <Route exact name="TradeCoin" path="/trading" component={TradeCoin} />
                <Redirect exact from="/" to="/trading" />

                {/** Declare route above this line */}
            </Switch>
        )
    }
}

const mapStateToProps = (state: StateReducer) => {
    return {}
}

export default connect(mapStateToProps, null)(Routes)
