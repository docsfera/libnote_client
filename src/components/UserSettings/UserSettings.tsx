import React, {useState} from 'react'
import "./UserSettings.sass"
import Header from "../Header/Header"
import {AuthContext} from "../../AuthProvider"
import {gql, useMutation} from "@apollo/client"
import ButtonQuery from "../ButtonQuery/ButtonQuery"

const UPDATE_USER_NAME = gql`
    mutation updateUserName($id: ID, $name: String){
        updateUserName(id: $id, name: $name) {
            id
        }
    }
`
const UPDATE_USER_PASSWORD = gql`
    mutation updateUserPassword($id: ID, $password: String){
        updateUserPassword(id: $id, password: $password) {
            id
        }
    }
`

const UserSettings = () => {
    const {userInfo, setNewUserName, onLogout} = React.useContext(AuthContext)
    const [userName, setUserName] = useState(userInfo.mail)
    const [errorMessage, setErrorMessage] = useState("")
    const [oldUserPassword, setOldUserPassword] = useState("")
    const [newUserPassword, setNewUserPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    const [isLoadingChangePassword, setIsLoadingChangePassword] = useState(false)
    const [isLoadingUpdateUserName, setIsLoadingUpdateUserName] = useState(false)

    const [updateUserName] = useMutation(UPDATE_USER_NAME)
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD)

    const updateUserNameEvent = async () => {
        setIsLoadingUpdateUserName(true)
        await updateUserName({variables: { id: userInfo.id, name: userName}})
        setNewUserName(userName)
        setIsLoadingUpdateUserName(false)
        //navigate("../books")
    }

    const changePasswordEvent = async () => {

        // setIsLoginError(false)
        // setIsPasswordError(false)
        setIsLoadingChangePassword(true)

        const formData = new FormData()
        formData.append('id', userInfo.id)
        formData.append('oldPassword', oldUserPassword)
        formData.append('newPassword', newUserPassword)
        formData.append('confirmPassword', confirmNewPassword)

        await fetch('/changePassword', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(async errors =>  {
            console.log({errors})
            setErrorMessage(errors.message)
            if(errors.message.includes("ok")) {
                console.log('okkkkk')
                setErrorMessage("")
                await updateUserPassword({variables: {id: userInfo.id, password: newUserPassword}})
                setIsLoadingChangePassword(false)
            }
        })
        //     .then(async errors =>  {
        //         setErrorMessage(errors.message)
        //         errors.message.includes("Login") && setIsLoginError(true)
        //         errors.message.includes("Password") && setIsPasswordError(true)
        //         if(errors.message.includes("ok")) {
        //             setErrorMessage("")
        //             await createUser({variables: {input: {mail: userName, password: userPassword}}})
        //                 .then((res) => {
        //                     token.onLogin({
        //                         id: res.data.createUser.id,
        //                         mail: res.data.createUser.mail,
        //                         token: "token"
        //                     }).catch(() => alert("Что-то пошло не так"))
        //                 })
        //         }
        //     })
    }


    return (
        <div className="user-settings-component">
            <Header/>
            <div className="user-settings-wrapper">
                <div className="user-settings">
                    <h2>Настройки</h2>
                    <h3>Редактирование профиля</h3>
                    <div className="photo-settings">
                        <img className="user-avatar" src="/images/avatar.png" alt=""/>
                        <button className="button" onClick={() => alert("Функция в разработке!")}>Загрузить фото</button>
                    </div>
                    <p className="error">{errorMessage}</p>
                    <p className="user-name">Имя пользователя</p>
                    <input type="text"
                           className="input"
                           value={userName}
                           onChange={(e) => setUserName(e.target.value)}
                    />
                    <ButtonQuery
                        type="Create"
                        width={150}
                        name="Сохранить"
                        callBack={updateUserNameEvent}
                        isLoading={isLoadingUpdateUserName}
                    />

                    <p className="user-name">Старый пароль</p>
                    <input type="text"
                           className="input"
                           value={oldUserPassword}
                           onChange={(e) => setOldUserPassword(e.target.value)}
                    />
                    <p className="user-name">Новый пароль</p>
                    <input type="text"
                           className="input"
                           value={newUserPassword}
                           onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                    <p className="user-name">Подтверждение нового пароля</p>
                    <input type="text"
                           className="input"
                           value={confirmNewPassword}
                           onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <ButtonQuery
                        type="Create"
                        width={220}
                        name="Изменить пароль"
                        callBack={changePasswordEvent}
                        isLoading={isLoadingChangePassword}
                    />

                    <ButtonQuery
                        type="Exit"
                        width={150}
                        name="Выход"
                        callBack={onLogout}
                    />

                </div>
            </div>

        </div>
    )
}

export default UserSettings