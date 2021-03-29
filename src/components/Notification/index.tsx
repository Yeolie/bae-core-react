import React from "react"
import { ToastContainer, toast, ToastOptions } from "react-toastify"
// import { ReactComponent as SuccessIcon } from "./verified.svg"
// import { ReactComponent as InfoIcon } from "./exclamation.svg"
// import { ReactComponent as ErrorIcon } from "./danger.svg"
// import { ReactComponent as WarningIcon } from "./danger.svg"

// const typeList = {
//     info: <InfoIcon />,
//     error: <ErrorIcon />,
//     warning: <WarningIcon />,
//     success: <SuccessIcon />
// }

type typeNoti = "info" | "error" | "warning" | "success"

const NotificationComponent = (props) => (
    <div className="notification-body">
        <div className={`notification-type notification-type-${props.type}`}></div>
        <div className="notification-content">{props.value}</div>
    </div>
)

const notify = (value: React.ReactNode, type: typeNoti = "info", options: ToastOptions = null) =>
    toast(<NotificationComponent value={<span>{value}</span>} type={type} />, options)

const NotificationContainer = () => (
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        draggable
        pauseOnHover
        closeButton={false}
    />
)

export { notify, NotificationContainer }
