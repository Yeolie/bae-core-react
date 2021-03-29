import React from "react"
import { ReactComponent as NoRoleIcon } from "./no-role.svg"
import "./index.scss"

interface ForbiddenProps {

}

export const Forbidden: React.FC<ForbiddenProps> = (props) => {
    return (
        <div className="forbidden-state forbidden-page block-center block-column m-t-80">
            <NoRoleIcon />
            <div className="title text-bold m-t-40 m-b-12">Bạn không có quyền truy cập</div>
            <div className="subtitle">Vui lòng liên hệ cấp trên để cấp quyền</div>
        </div>
    )
}