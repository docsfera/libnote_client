import React, {useEffect, useRef, useState} from 'react'
import "./Folder.sass"
import withFolderDeleteEvent from "../../HOC/withFolderDeleteEvent"
import withSearchMark from "../../HOC/withSearchMark"
import cn from "classnames"
import DeleteIcon from "../DeleteIcon/DeleteIcon"
import {FolderType} from "../../types/types"

type FolderComponentType = {
    folder: FolderType
    isLoading: boolean
    searchWord?: string

    insertMarkHTML: (componentName: string, searchWord: string | undefined) => string
    useGetCountNotesByFolder: (folderId: string) => number
    deleteFolderEvent: () => void
    refetchFolders?: () => void
    showFolderNotes?: (id: string) => void
}

const Folder: React.FC<FolderComponentType> = (props) => {
    const folderNameRef = useRef<HTMLParagraphElement>(null)
    const [isHover, setIsHover] = useState(false)

    useEffect(() => {
        if(folderNameRef && folderNameRef.current ){
            folderNameRef.current.innerHTML = props.insertMarkHTML(props.folder.name, props.searchWord)
        }
    }, [props.searchWord])

    const showFolderNotes = () => props.showFolderNotes && props.showFolderNotes(props.folder.id)

    return (
        <div className={cn("folder", {"folder-loading": props.isLoading})}
             onMouseOver={() => setIsHover(true)}
             onMouseOut={() => setIsHover(false)}>
            <div className="folder-info">
                <div className="folder-count">{props.folder.countofnotes}</div>
                <DeleteIcon
                    type="Folder"
                    isLoading={props.isLoading}
                    callback={props.deleteFolderEvent}
                    isHover={isHover}
                />
            </div>
            <div className="folder-image" onClick={showFolderNotes}> </div>
            <p ref={folderNameRef} className="folder-name"> </p>
        </div>
    )
}

export default withFolderDeleteEvent(withSearchMark(Folder))