import React, {Component} from 'react'
import Aside from "../components/Aside/Aside"

const WithAside = (Component: any) => {
    function withAside() {
        return <>
                <Aside/>
                <Component/>
            </>
    }
    return withAside
}
export {}
export default WithAside