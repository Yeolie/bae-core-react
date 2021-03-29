import React from "react"
import classnames from "classnames"

import "./index.scss"

interface AvatarProps {
    className?: string
    name: string
    source?: string
    color?: string
}
interface AvatarStates {
    checkAvatar: boolean
    loading: boolean
}
export class Avatar extends React.PureComponent<AvatarProps, AvatarStates> {
    constructor(props) {
        super(props)
        this.state = {
            checkAvatar: true,
            loading: true
        }
    }
    private onError = () => {
        this.setState({
            checkAvatar: false,
            loading: false
        })
    }
    private onSuccess = () => {
        this.setState({
            checkAvatar: true,
            loading: false
        })
    }
    render() {
        const { name, source, color, className } = this.props
        const { checkAvatar, loading } = this.state
        let style: React.CSSProperties = {
            background : color || "hsl(" + Math.random() * 360 + ", 100%, 75%)"
        }
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return (
            <div className={classnames("avatar", { [className]: className })} style={style}>
                { (source && loading) && "L"}
                { (source && checkAvatar) ? <img src={source} alt="avatar" onLoad={this.onSuccess} onError={this.onError} /> : (name?.charAt(0) || characters.charAt(Math.floor(Math.random() * characters.length)) ) }
            </div>
        )
    }
}
