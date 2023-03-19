import React, {useEffect, useState} from 'react'
import "./NewNotes.sass"
import {useNavigate} from "react-router-dom"
import SectionInfo from "../SectionInfo/SectionInfo"
import {getPathToNoteCreate} from "../../Functions"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import NotesComponent from "../NotesComponent/NotesComponent"
import {NoteType} from "../../types/types"

type NewNotesType = {
    data: {getAllNotes: NoteType[]} | undefined
    isLoading: boolean
}

const NewNotes: React.FC<NewNotesType> = (props) => {

    const [notesData, setNotesData] = useState<any>([])
    useEffect(() => {
        setNotesData(props.data)
    }, [props.data])

    const navigate = useNavigate()
    const goToNoteCreator = (noteId?: string) => navigate(getPathToNoteCreate(noteId))

    let notesCount: number
    notesData?.getAllNotes ? notesCount = notesData.getAllNotes.length : notesCount = 0

    return (
        <div className="notes-section">
            <div className="notes-wrapper">
                <SectionInfo nameSection="Notes" sectionCount={props.isLoading ? "..." : notesCount} isLink={true}/>
                <ButtonCreate name="Создать заметку" onClick={() => goToNoteCreator()}/>
            </div>
            <div className="notes">
                <NotesComponent goToNoteCreator={goToNoteCreator} />
            </div>
        </div>
    )
}

export default NewNotes