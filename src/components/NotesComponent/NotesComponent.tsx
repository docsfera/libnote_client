import React, {useEffect} from 'react'
import {AuthContext} from "../../AuthProvider"
import {gql, useQuery} from "@apollo/client"
import Note from "../Note/Note"
import "./NotesComponent.sass"
import {CurrentNoteType, NoteType} from "../../types/types"

const GET_ALL_NOTES = gql`
    query getAllNotes($userid: ID) {
        getAllNotes(userid: $userid){
            id
            title
            folderid
            bookid
            content
            dateupdate
        }
    }
`

type NotesComponentType = {
    data?: any /// todo: any
    goToNoteCreator?: (noteId?: string) => void
    getNoteCreatorComponentEvent?: (noteName: string,
                                    noteContent: string,
                                    bookId?: string,
                                    folderId?: string,
                                    noteId?: string) => void
    searchWord?: string
    condition?: (note: NoteType, searchWord: string) => NoteType | undefined
    isShowNoteCreator?: boolean
    currentNoteData?: CurrentNoteType
}

const NotesComponent: React.FC<NotesComponentType> = (props) => {
    const {userInfo} = React.useContext(AuthContext)
    const {data, loading, refetch} = useQuery<{getAllNotes: NoteType[]}>(GET_ALL_NOTES, {variables: {userid: userInfo.id}})

    useEffect(() => {refetch()},[props?.isShowNoteCreator])

    const getData = () => {
        let currentData: NoteType[] = []
        if(props.data){
            currentData = props.data
        }else if(!props.data && data?.getAllNotes){
            currentData = data.getAllNotes
        }
        //todo: ts-ignore
        if(props.condition && props.searchWord) {
            // @ts-ignore
            return currentData.filter((i) => props.condition(i, props.searchWord))
        }else{
            return currentData
        }
    }

    return (
        <div className="notes">

            {loading
                ?
                <>
                    <div className="note-skeleton"> </div>
                    <div className="note-skeleton"> </div>
                    <div className="note-skeleton"> </div>
                    <div className="note-skeleton"> </div>
                </>
                : getData().map((i) =>
                    <Note noteId={i.id}
                          key={i.id}
                          folderId={i.folderid}
                          bookId={i.bookid}
                          noteContent={i.content}
                          dateUpdate={i.dateupdate}
                          noteName={i.title}
                          refetchNotes={refetch}
                          goToNoteCreator={props.goToNoteCreator}
                          getNoteCreatorComponentEvent={props.getNoteCreatorComponentEvent}
                          searchWord={props.searchWord}
                          currentNoteData={props.currentNoteData}
                    />)
            }
        </div>
    )
}

export default NotesComponent