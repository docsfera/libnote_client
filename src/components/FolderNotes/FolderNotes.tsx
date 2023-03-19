import React, {useEffect, useState} from 'react'
import "./FolderNotes.sass"
import {useQuery, gql, useMutation} from "@apollo/client"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import NotesComponent from "../NotesComponent/NotesComponent"
import {getPathToNoteCreate} from "../../Functions"
import {FolderType, NoteType} from "../../types/types"

//TODO: dont repeat yourself
const GET_NOTES_BY_FOLDER = gql` 
    query getNotesByFolder($folderid: ID){
        getNotesByFolder(folderid: $folderid) {
            id
            title
            content
            folderid
            bookid
            dateupdate
        }
    }
`
const GET_FOLDER_BY_ID = gql` 
    query getFolderById($id: ID){
        getFolderById(id: $id) {
            name
            countofnotes
        }
    }
`
const UPDATE_FOLDER_NAME = gql` 
    mutation updateFolderName($id: ID, $name: String){
        updateFolderName(id: $id, name: $name) {
            name
            id
        }
    }
`
const FolderNotes = () => {
    const {id} = useParams()
    const { state } = useLocation() //TODO: any
    const [updateFolderName] = useMutation(UPDATE_FOLDER_NAME)
    const {data, refetch} = useQuery<{getNotesByFolder: NoteType[]}>(GET_NOTES_BY_FOLDER, {variables: {folderid: id}})
    const currentFolder = useQuery<{getFolderById: FolderType}>(GET_FOLDER_BY_ID, {variables: {id}})
    const currentFolderData = currentFolder.data
    const currentFolderRefetch = currentFolder.refetch

    useEffect(() => {
        if(currentFolderData && currentFolderData.getFolderById){
            setFolderName(currentFolderData.getFolderById.name)
        }
        refetch()
    }, [currentFolder])

    const [folderName, setFolderName] = useState("")
    const navigate = useNavigate()

    //TODO withGoToNoteCreator???

    const goToNoteCreator = (noteId?: string) => navigate(getPathToNoteCreate(noteId), {state: {folderId: id}})


    const renameFolderEvent = async (name: string) => { //TODO: а если имя не изменилось?

        if( folderName !== name){
            setFolderName(name)
            await updateFolderName(
                {
                    variables: {
                        id, name
                    }
                })
            if(state?.refetch){
                await state.refetch()
            }
            await currentFolderRefetch() //?
        }
    }

    return (
        <div className="folder-notes">
            <div className="folder-notes-wrapper">
                <div className="folder-info">
                    <div className="folder-name"
                         contentEditable="true"
                         onBlur={(e) => renameFolderEvent(e.target.innerText)}>{folderName}</div>

                    <div className="count-notes">{`Всего заметок ${data && data.getNotesByFolder.length}`}</div>
                </div>
                <ButtonCreate name="Создать заметку" onClick={() => goToNoteCreator()}/>
            </div>
            <NotesComponent data={data?.getNotesByFolder} goToNoteCreator={goToNoteCreator}/>
        </div>
    )
};

export default FolderNotes;