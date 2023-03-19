import React, {useEffect, useRef} from "react"
import {
    Routes,
    Route,
    NavLink,
    useNavigate,
} from 'react-router-dom';
import PdfAside from "./components/PdfAside/PdfAside";
import {gql, useQuery} from "@apollo/client";

const GET_USER_BY_TOKEN = gql`
    query getUserByToken($token: String){
        getUserByToken(token: $token){
            id
            mail
        }
    }
`

export const AuthContext = React.createContext<any>(null)

type UserType = {
    id: string | null
    mail: string | null
    token: string | null
}


const AuthProvider = ({ children }: any) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const {data} = useQuery(GET_USER_BY_TOKEN, {variables:{token}})

    const [userInfo, setUserInfo] = React.useState<UserType>({id: null, mail: null, token: token})

    const smokeWindow = useRef<HTMLDivElement>(null)

    const hideSmokeWindow = () => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.display = "none"
        }
    }
    const showSmokeWindow = () => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}px`
            smokeWindow.current.style.display = "block"
        }
    }

    useEffect(() => {
        if(data){
            console.log('here', data)
            setUserInfo({id: data.getUserByToken.id, mail: data.getUserByToken.mail, token})
        }

    }, [data])

    console.log(userInfo)
    const fakeAuth = () =>
        new Promise((resolve) => {
            setTimeout(() => resolve('2342f2f1d131rf12'), 250);
        });

    const handleLogin = async (user: UserType) => {
        //const token = await fakeAuth();
        if (typeof user.token === "string") {
            localStorage.setItem('token', user.token)
        }
        //@ts-ignore
        setUserInfo({id: user.id, mail: user.mail, token: user.token})
        navigate('/')
    };

    const handleLogout = () => {
        console.log('here')
        localStorage.removeItem('token')
        setUserInfo({id: null, mail: null, token: null})
    };

    const redirectToAuth = () => {
        navigate('/auth')
    }

    const setNewUserName = (name: any) => {
        setUserInfo({id: userInfo.id, mail: name, token: userInfo.token})
    }

    const value = {
        userInfo,
        onLogin: handleLogin,
        onLogout: handleLogout,
        redirectToAuth,
        setNewUserName,
        hideSmokeWindow,
        showSmokeWindow
    };

    return (
        <AuthContext.Provider value={value}>
            <div ref={smokeWindow} className="smoke"> </div>
                {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider