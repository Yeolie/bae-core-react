import React from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import Components from "./components"
import { configureStore } from "./store"
import Routes from "./routes"

import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"

import "./styles/main.scss"

const store = configureStore()

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Routes />
                <Components.NotificationContainer />
                <Components.FloatingButtonContainer />
            </Provider>
        </BrowserRouter>
    )
}

export default App
