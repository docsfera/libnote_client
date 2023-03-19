import React, {useEffect, useRef, useState} from 'react'
import Folder from "../Folder/Folder"
import Arrow from "../Arrow/Arrow"
import "./NewFolders.sass"
import {gql, useQuery} from "@apollo/client"
import  {useNavigate} from "react-router-dom"
import FolderCreateWindow from "../FolderCreateWindow/FolderCreateWindow"
import SectionInfo from "../SectionInfo/SectionInfo"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import {FolderType} from "../../types/types"
import {AuthContext} from "../../AuthProvider"


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

type FoldersType = {
    numOfNotes: number | undefined
}

const NewFolders: React.FC<FoldersType> = (props) => {
    const {userInfo} = React.useContext(AuthContext)
    const { loading, data, error, refetch} = useQuery<{ getAllFolders: FolderType[] }>
    (GET_ALL_FOLDERS, {variables: {userid: userInfo.id}})

    useEffect(() => { refetch() }, [props.numOfNotes])

    const navigate = useNavigate()
    const [isShowFolderCreator, setIsShowFolderCreator] = useState(false)



    const [position, setPosition] = useState(0)

    const showFolderNotes = (id: string) => {
        navigate(`/folder-notes/${id}`, {state: {refetch}})
    }

    let folderCount: number
    data ? folderCount = data.getAllFolders.length : folderCount = 0
    const foldersContainer = useRef<HTMLDivElement>(null)
    const folderSection = useRef<HTMLDivElement>(null)
    const folderWidth = 200

    const useGetCountNotesByFolder = (folderId: string) => {
        const { data } = useQuery(GET_NOTES_BY_FOLDER, {variables: {folderId}})
        if(data && data.getNotesByFolder) {
            return data.getNotesByFolder.length
        }else{
            return 0
        }
    }

    return (
        <div className="folders-section" ref={folderSection}>
            {isShowFolderCreator
                && <FolderCreateWindow setIsShowFolderCreator={setIsShowFolderCreator} refetch={refetch}/>
            }

            <div className="folders-wrapper">
                <SectionInfo nameSection="Folders" sectionCount={loading ? "..." : folderCount} isLink={true}/>
                <ButtonCreate name="Создать папку" onClick={() => setIsShowFolderCreator(true)}/>
            </div>

            <div className="folders">
                <Arrow sectionContainer={foldersContainer?.current}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection?.current}
                       sectionCount={folderCount}
                       isLeftArrow={true}
                       maxCountToShow={4}
                />

                <div className="folders-container">
                    <div ref={foldersContainer} className="itemser">

                        {loading &&
                            <>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                                <div className="folder-skeleton"> </div>
                            </>
                        }


                        {data?.getAllFolders && data.getAllFolders.map( (i) =>
                            <Folder
                                folder={i}
                                key={i.id}
                                useGetCountNotesByFolder={useGetCountNotesByFolder}
                                showFolderNotes={showFolderNotes}
                                refetchFolders={refetch}
                            />)
                        }
                    </div>

                </div>
                <Arrow sectionContainer={foldersContainer?.current}
                       position={position}
                       elementWidth={folderWidth}
                       setPosition={setPosition}
                       currentSection={folderSection?.current}
                       sectionCount={folderCount}
                       isLeftArrow={false}
                       maxCountToShow={4}
                />
            </div>
        </div>
    )
}

export default NewFolders