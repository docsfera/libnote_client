import React from 'react'
import "./DeleteIcon.sass"
import cn from "classnames"

type DeleteIconProps = {
    type: "Folder" | "Note"
    isLoading: boolean
    isHover: boolean
    callback: any
}

const DeleteIcon: React.FC<DeleteIconProps> = (props) => {

    const deleteEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        if(props.type === "Note"){
            props.callback(e)
        }else{
            props.callback()
        }
    }

    return (
        <div className={cn("delete-icon", {
            "note-delete": props.type === "Note",
            "animation": props.isLoading,
            "hover": props.isHover
        })} onClick={(e) => deleteEvent(e)}>

        </div>
    )
}

export default DeleteIcon