import React from 'react'

const withSearchMark = (Component: any) => {
    function WithMark(props: any) {
        const insertMark = (str: string, pos: number, len: number) =>{
            if(pos === 0 && len === 0) return str
            return str.slice(0, pos) + '<mark>' + str.slice(pos, pos+len) + '</mark>' + str.slice(pos+len)
        }

        const insertMarkHTML = (componentName: string, searchWord: string | undefined) => {
            if(searchWord){
                return insertMark(componentName, componentName.toLowerCase().search(searchWord.toLowerCase()), searchWord.length)
            }else{
                return componentName
            }
        }

        return <Component insertMarkHTML={insertMarkHTML} {...props} />
    }
    return WithMark
}

export default withSearchMark