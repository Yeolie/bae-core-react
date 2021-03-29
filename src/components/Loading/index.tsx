import React, { useCallback, useEffect, useRef, useState } from "react"
import { ProgressBar } from "react-bootstrap"
import Logo from "./GHN_Color.png"

import "./index.scss"

interface LoadingProps {}

let currentProcess = 0

export const Loading: React.FC<LoadingProps> = () => {
    const [percent, setPercent] = useState(currentProcess)

    let timeout = useRef(null)

    const fakePercent = useCallback(() => {
        let percentChange = currentProcess
        timeout.current = setInterval(() => {
            if (percentChange >= 90) {
                setPercent(90)
                clearInterval(timeout.current)
                return
            }
            percentChange = percentChange + 30

            currentProcess = percentChange
            setPercent(percentChange)
        }, 100)
    }, [timeout])

    useEffect(() => {
        fakePercent()

        return () => {
            clearInterval(timeout.current)
        }
    }, [fakePercent, timeout])

    return (
        <div className="loading-screen">
            <div className="loading-container">
                <span className="mb-1">
                    <img className="logo" src={Logo} alt="Logo" width={120} />
                </span>
                <div className="loading-progress-container">
                    <ProgressBar now={percent} className="loading-progress-bar" />
                </div>
                <span className="mt-1">Loading...</span>
            </div>
        </div>
    )
}
