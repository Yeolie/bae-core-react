import React from "react"

interface TradeCoinProps {}

interface TradeCoinState {}

class TradeCoin extends React.Component<TradeCoinProps, TradeCoinState> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <div>
            <h3 className='text-center'>Binance trade history</h3>
            <div></div>
        </div>
    }
}

export default TradeCoin