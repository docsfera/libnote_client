import React, {useState} from 'react'
import {gql, useMutation} from "@apollo/client"

const DELETE_FOLDER_BY_ID = gql`
    mutation deleteFolderById($id: ID) {
        deleteFolderById(id: $id) {
            id
        }
    }
`

const withFolderDeleteEvent= (Component: any) => {
    function WithDelete(props: any) {
        const [deleteFolderById] = useMutation(DELETE_FOLDER_BY_ID)
        const [isLoadingDeleteFolder, setIsLoadingDeleteFolder] = useState(false)
        const deleteFolderEvent = async () => {
            setIsLoadingDeleteFolder(true)
            await deleteFolderById(
                {
                    variables: {
                        id: props.folder.id
                    }
                })

            await props.refetchFolders()
            setIsLoadingDeleteFolder(false)
        }
        return <Component deleteFolderEvent={deleteFolderEvent} isLoading={isLoadingDeleteFolder} {...props} />
    }
    return WithDelete
}

export default withFolderDeleteEvent