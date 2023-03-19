import {gql, useMutation} from "@apollo/client"

const DELETE_NOTE_BY_ID = gql`
      mutation deleteNoteById($noteid: ID) {
        deleteNoteById(noteid: $noteid){
            id
        }
    }
`
const UPDATE_FOLDER_COUNT_NOTES = gql`
    mutation updateFolderCountNotes($folderid: ID, $mode: String){
        updateFolderCountNotes(folderid: $folderid, mode: $mode) {
            id
        }
    }
`

const useDeleteNoteEvent = async (noteId: string, folderId: any, refetch: any) => {
    const [deleteNote] = useMutation(DELETE_NOTE_BY_ID)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)
    await deleteNote({variables: {noteid: noteId}})
    folderId && await updateFolderCountNotes({variables: {folderid: folderId, mode: "-"}})
    await refetch()
}

export default useDeleteNoteEvent