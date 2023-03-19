import React from 'react'
import "./NoteCreatorComponent.sass"
import NoteCreator from "../NoteCreator/NoteCreator"
import {BookType, CurrentNoteType} from "../../types/types"

type NoteCreatorComponentType = {
    userId: string
    currentNoteData: CurrentNoteType
    setCurrentNoteData: any
    book: BookType
}

const NoteCreatorComponent: React.FC<NoteCreatorComponentType> = (props) => {
    return (
        <div className="note-creator-component">
            <NoteCreator
                isShowHeader={false}
                currentNoteData={props.currentNoteData}
                setCurrentNoteData={props.setCurrentNoteData}
                book={props.book}
            />
        </div>
    )
}

export default NoteCreatorComponent