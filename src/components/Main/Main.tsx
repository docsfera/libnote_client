import React, {useEffect} from 'react'
import "./Main.sass"
import Header from "../Header/Header"
import NewFolders from "../NewFolders/NewFolders"
import NewBooks from "../NewBooks/NewBooks"
import NewNotes from "../NewNotes/NewNotes"
import {AuthContext} from "../../AuthProvider"
import {useQuery, gql} from '@apollo/client'
import {NoteType} from "../../types/types"

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            content
            folderid
            bookid
            dateupdate
        }
    }
`

const Main = () => {
    const {userInfo} = React.useContext(AuthContext)
    const {data, loading, refetch} = useQuery<{getAllNotes: NoteType[]}>(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    useEffect(() => { refetch() }, [])
    const numOfNotes = data?.getAllNotes.length

    return (
        <div>
            <Header/>
            <div className="main">
                <NewFolders numOfNotes={numOfNotes}/>
                <NewBooks/>
                <NewNotes data={data} isLoading={loading}/>
            </div>
        </div>
    )
}
export default Main