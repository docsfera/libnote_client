import React, {useState} from 'react'
import {gql, useMutation} from "@apollo/client"

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
`

const withNoteDeleteEvent = (Component: any) => {
    function WithDelete(props: any) {
        const {noteId, refetchNotes} = props
        const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)
        const [isLoadingDeleteNote, setIsLoadingDeleteNote] = useState(false)
        const deleteNoteEvent = async () => {
            setIsLoadingDeleteNote(true)
            await deleteNote({variables: {noteid: noteId}})
            await refetchNotes()
            setIsLoadingDeleteNote(false)
        }
        return <Component deleteNoteEvent={deleteNoteEvent} isLoading={isLoadingDeleteNote} {...props} />
    }
    return WithDelete
}

export default withNoteDeleteEvent