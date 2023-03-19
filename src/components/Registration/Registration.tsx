import React, {useState} from 'react'
import cn from "classnames"
import {gql, useMutation} from "@apollo/client"
import {AuthContext} from "../../AuthProvider"

const CREATE_USER = gql`
    mutation createUser($input: UserInput) {
        createUser(input: $input){
            id
            mail
        }
    }
`

type RegistrationType = {
    changeAuthType: () => void
}

const Registration: React.FC<RegistrationType> = (props) => {

    const [createUser] = useMutation(CREATE_USER)
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoginError, setIsLoginError] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)

    const token = React.useContext(AuthContext)
    console.log({token})

    const loginEvent = async () => {

        setIsLoginError(false)
        setIsPasswordError(false)

        const formData = new FormData()
        formData.append('mail', userName)
        formData.append('password', userPassword)
        formData.append('confirmPassword', confirmPassword)

        await fetch('https://linote-server-2.onrender.com/registration', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(async errors =>  {
                setErrorMessage(errors.message)
                errors.message.includes("Login") && setIsLoginError(true)
                errors.message.includes("Password") && setIsPasswordError(true)
                if(errors.message.includes("ok")) {
                    setErrorMessage("")
                    console.log(errors)
                    token.onLogin(
                        {
                            id: errors.userId,
                            mail: errors.mail,
                            token: "token"
                        })
                }
                    // await createUser({variables: {input: {mail: userName, password: userPassword}}})
                    //  .then((res) => {
                    //      token.onLogin({
                    //          id: res.data.createUser.id,
                    //          mail: res.data.createUser.mail,
                    //          token: "token"
                    //      }).catch(() => alert("Что-то пошло не так"))
                    //  })
                })
        }


    return (
        <div className="auth-inputs">
            <p className="name-section">Регистрация</p>
            <div className="input-section">
                <p className="error">{errorMessage}</p>
                <p className="name-input">Имя пользователя</p>
                <input className={cn("input", {"input-error": isLoginError})} type="text" placeholder="Введите логин" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </div>

            <div className="input-section">
                <p className="name-input">Пароль</p>
                <input
                    className={cn("input", {"input-error": isPasswordError})}
                    type="password"
                    placeholder="Введите пароль"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                />
            </div>

            <div className="input-section">
                <p className="name-input">Подтвердить пароль</p>
                <input
                    className={cn("input", {"input-error": isPasswordError})}
                    placeholder="Подтвердите пароль"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="create-account" onClick={loginEvent}>Создать аккаунт</button>
            <p className="auth-wrap" onClick={props.changeAuthType}>Войти</p>

            </div>
    )
}

export default Registration