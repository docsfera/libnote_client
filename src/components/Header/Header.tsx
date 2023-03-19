import React from 'react'
import "./Header.sass"
import {AuthContext} from "../../AuthProvider"
import Avatar from "../Avatar/Avatar";

type HeaderType = {
    searchWord?: string
    setSearchWord?: React.Dispatch<React.SetStateAction<string>>
    isShow?: boolean //TODO: fix
}

const Header: React.FC<HeaderType> = (props) => {
    const {userInfo} = React.useContext(AuthContext)
    const setSearchWord = (value: string) => props.setSearchWord && props.setSearchWord(value)

    return (
        <header className="header">
            {props.isShow && <input type="text"
                                       className="search"
                                       value={props.searchWord}
                                       onChange={(e) => setSearchWord(e.target.value)}/>}
            <p className="user-name">{userInfo.mail}</p>
            <img src={`${process.env.PUBLIC_URL}/images/avatar.png`} alt="" className="user-avatar"/>
            {/*<Avatar/>*/}
        </header>
    )
}

export default Header