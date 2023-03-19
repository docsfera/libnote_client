import React, {useEffect, useState} from 'react'
import "./Folders.sass"
import Header from "../Header/Header"
import SectionInfo from "../SectionInfo/SectionInfo"
import {gql, useQuery} from "@apollo/client"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../../AuthProvider"
import Folder from "../Folder/Folder"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import FolderCreateWindow from "../FolderCreateWindow/FolderCreateWindow"
import {FolderType} from "../../types/types"

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid){
            id
            name
            countofnotes
        }
    }
`

const GET_NOTES_BY_FOLDER = gql`
    query getNotesByFolder($folderid: ID) {
        getNotesByFolder(folderid: $folderid){
            id
        }
    }
`

const Folders = () => {
    const {userInfo} = React.useContext(AuthContext)
    const [searchWord, setSearchWord] = useState("")
    const [isShowFolderCreator, setIsShowFolderCreator] = useState(false)
    const navigate = useNavigate()

    const {data, loading, refetch} = useQuery<{getAllFolders: FolderType[]}>(GET_ALL_FOLDERS, {variables: {userid: userInfo.id}})

    useEffect( () => { refetch() }, [])

    let foldersCount
    data ? foldersCount = data.getAllFolders.length : foldersCount = 0

    const useGetCountNotesByFolder = (folderId: any) => { // TODO: repeated in NewFolders
        const { data} = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderId}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    const condition = (folder: FolderType, searchWord: string) => {
        if(folder.name.toLowerCase().includes(searchWord.toLowerCase())){
            return folder
        }
    }

    const showFolderNotes = (id: string) => navigate(`/folder-notes/${id}`)

    return (
        <div>
            <Header setSearchWord={setSearchWord} isShow={true}/>
            <div className="folders-container">
                {isShowFolderCreator && <FolderCreateWindow setIsShowFolderCreator={setIsShowFolderCreator} refetch={refetch}/>}
                <div className="folders-wrapper">
                    <SectionInfo nameSection="Folders" sectionCount={loading ? "..." : foldersCount}/>
                    <ButtonCreate name="Создать папку" onClick={() => setIsShowFolderCreator(true)}/>
                </div>

                <div className="folders">

                    {loading
                        ?
                            <>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                            </>
                        : data?.getAllFolders.filter((i) => condition(i, searchWord)).map((i) =>
                            <Folder folder={i}
                                    key={i.id}
                                    useGetCountNotesByFolder={useGetCountNotesByFolder}
                                    refetchFolders={refetch}
                                    showFolderNotes={showFolderNotes}
                                    searchWord={searchWord}
                            />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Folders