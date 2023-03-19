import React, {useState} from 'react'
import {AuthContext} from "../../AuthProvider"
import cn from "classnames"

type AuthType = {
    changeAuthType: () => void
}

const Auth: React.FC<AuthType> = (props) => {
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoginError, setIsLoginError] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)
    const token = React.useContext(AuthContext)

    const loginEvent = async () => {
        setIsLoginError(false)
        setIsPasswordError(false)

        const formData = new FormData()
        formData.append('mail', userName)
        formData.append('password', userPassword)

        await fetch('https://linote-server-2.onrender.com/login', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(errors => {
                setErrorMessage(errors.message)
                errors.message.includes("Login") && setIsLoginError(true)
                errors.message.includes("Password", "password") && setIsPasswordError(true)
                if (errors.message.includes("ok")) {
                    setErrorMessage("") // TODO: takoe...
                    //@ts-ignore
                    token.onLogin({
                        id: errors.user.id,
                        mail: errors.user.mail,
                        token: errors.user.token,
                    }).catch(() => alert("Что-то пошло не так"))
                }
            })
    }

    return (
        <div className="auth-inputs">
            <p className="name-section">Вход</p>
            <div className="input-section">
                <p className="error">{errorMessage}</p>
                <p className="name-input">Имя пользователя</p>
                <input className={cn("input", {"input-error": isLoginError})} type="text" placeholder="Введите логин" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </div>
            <div className="input-section">
                <p className="name-input">Пароль</p>
                <input className={cn("input", {"input-error": isPasswordError})}
                       type="password"
                       placeholder="Введите пароль"
                       value={userPassword}
                       onChange={(e) => setUserPassword(e.target.value)}/>
            </div>
            <button className="create-account" onClick={loginEvent}>Войти в аккаунт</button>
            <p className="auth-wrap" onClick={props.changeAuthType}>Регистрация</p>
        </div>
    )
}

export default Auth