import React, {useState} from 'react'
import "./PdfAside.sass"
import cn from 'classnames/dedupe'
import NotesComponent from "../NotesComponent/NotesComponent"
import ButtonCreate from "../ButtonCreate/ButtonCreate"
import {CurrentNoteType, NoteType} from "../../types/types"

type PdfAsideType = {
    isShowAside: boolean
    isShowNoteCreator: boolean
    isShowSmokeWindow: boolean
    setIsShowNoteCreator: (value: (((prevState: boolean) => boolean) | boolean)) => void
    setCurrentNoteData: any
    setIsShowSmokeWindow: (value: (((prevState: boolean) => boolean) | boolean)) => void
    setIsShowAside:  (value: (((prevState: boolean) => boolean) | boolean)) => void
    currentNoteData: CurrentNoteType
    userId: string
}

const PdfAside: React.FC<PdfAsideType> = (props) => {

    const [searchWord, setSearchWord] = useState("")

    const condition = (note: NoteType, searchWord: string) => {
        if(note.title.toLowerCase().includes(searchWord.toLowerCase())
            || note.content.toLowerCase().includes(searchWord.toLowerCase())){
            return note
        }
    }

    const getNoteCreatorComponentEvent = (
        noteName: string, noteContent: string, bookId?: string, folderId?: string, noteId?: string) => {

        !props.isShowNoteCreator && props.setIsShowNoteCreator(!props.isShowNoteCreator)
        props.setCurrentNoteData({name: noteName, content: noteContent, bookId, folderId, noteId})
        !props.isShowSmokeWindow && props.setIsShowSmokeWindow(!props.isShowSmokeWindow)
        props.setIsShowAside(!props.isShowAside)
    }

    const noteCreateEvent = () => {
        getNoteCreatorComponentEvent("Untitled", "", undefined, undefined, undefined)
    }


    return (
        <aside className={cn("book-aside", {"book-aside-active": props.isShowAside})} >
            <div className="book-aside-settings">
                <ButtonCreate name="Новая заметка" onClick={noteCreateEvent} />
                <input type="text" className="book-aside-input" value={searchWord} onChange={(e) => setSearchWord(e.target.value)}/>
            </div>

            <NotesComponent
                getNoteCreatorComponentEvent={getNoteCreatorComponentEvent}
                searchWord={searchWord}
                currentNoteData={props.currentNoteData}
                condition={condition}
                isShowNoteCreator={props.isShowNoteCreator}
            />
        </aside>
    )
}

export default PdfAside