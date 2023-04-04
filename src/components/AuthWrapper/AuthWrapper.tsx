import React, {useState} from 'react'
import "./AuthWrapper.scss"
import Auth from "../Auth/Auth"
import Registration from "../Registration/Registration"

const AuthWrapper = () => {
    const [isShowRegistration, setIsShowRegistration] = useState(false)

    const changeAuthType = () => {
        setIsShowRegistration(!isShowRegistration)
    }

    return (
        <div className="auth">
            <div className="auth-image "> </div>
            <div className="auth-container">
                {isShowRegistration ? <Registration changeAuthType={changeAuthType}/> : <Auth changeAuthType={changeAuthType}/>}
            </div>
        </div>
    )
}

export default AuthWrapper