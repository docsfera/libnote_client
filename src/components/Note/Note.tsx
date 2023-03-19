import React, {useEffect, useRef, useState} from 'react'
import "./Note.sass"
import cn from "classnames"
import withNoteDeleteEvent from "../../HOC/withNoteDeleteEvent"
import withSearchMark from "../../HOC/withSearchMark"
import DeleteIcon from "../DeleteIcon/DeleteIcon"
import {NoteType} from "../../types/types"
import {ApolloQueryResult, OperationVariables} from "@apollo/client"

type NoteProps = {
    noteId: string
    folderId?: string
    bookId?: string
    noteName: string
    noteContent: string
    dateUpdate: string
    deleteNoteEvent: () => void
    goToNoteCreator?: (noteId?: string) => void
    searchWord?: string
    getNoteCreatorComponentEvent?: (noteName: string,
                                    noteContent: string,
                                    bookId?: string,
                                    folderId?: string,
                                    noteId?: string) => void
    refetchNotes: (variables?: (Partial<OperationVariables> | undefined)) => Promise<ApolloQueryResult<{getAllNotes: NoteType[]}>>
    insertMarkHTML: any

    currentNoteData?: {
        name: string,
        content: string,
        bookId: string | undefined,
        bookName: string | undefined,
        folderId: string | undefined,
        folderName: string | undefined,
        noteId: string | undefined
    }

    isLoading: boolean
}

const Note: React.FC<NoteProps> = (props) => {

    // const dateFormatter = (date: string) => {
    //     const strDate = new Date(+date)
    //     const getCorrectNum = (num: number) => (num < 10) ? `0${num}` : num
    //     const days = strDate.getDate()
    //     const months = strDate.getMonth() + 1
    //     return `${getCorrectNum(days)}.${getCorrectNum(months)}.${strDate.getFullYear()}`
    // }

    const noteNameRef = useRef<HTMLDivElement>(null)
    const noteContentRef = useRef<HTMLDivElement>(null)
    const [isClicked, setIsClicked] = useState(true)
    const [isHover, setIsHover] = useState(false)


    useEffect(() => {
        if(noteNameRef && noteNameRef.current && noteContentRef && noteContentRef.current){
            noteNameRef.current.innerHTML = props.insertMarkHTML(props.noteName, props.searchWord)
            noteContentRef.current.innerHTML = props.insertMarkHTML(props.noteContent, props.searchWord)
        }
        if(props.noteId && props.currentNoteData && props.currentNoteData.noteId){
            (props.noteId === props.currentNoteData.noteId) ? setIsClicked(false) : setIsClicked(true)
        }
    }, [props])

    const noteClickEvent = () => {
        console.log('here_0')
        if(!props.currentNoteData || !props.currentNoteData.noteId ){
            console.log('here_1')
            props.goToNoteCreator && props.goToNoteCreator(props.noteId)
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.noteName, props.noteContent, props.bookId, props.folderId, props.noteId)
        }

        if(props.currentNoteData && props.currentNoteData.noteId !== props.noteId){
            console.log('here_2')
            props.goToNoteCreator && props.goToNoteCreator(props.noteId)
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.noteName, props.noteContent, props.bookId, props.folderId, props.noteId)
        }

        if(props.currentNoteData && props.currentNoteData.noteId && props.currentNoteData.noteId === props.noteId){ // Если выбирается заметка которая является текущей (редактируется)
            console.log('here_3')
            props.getNoteCreatorComponentEvent
            && props.getNoteCreatorComponentEvent(props.currentNoteData.name,
                props.currentNoteData.content, props.currentNoteData.bookId,
                props.currentNoteData.folderId, props.currentNoteData.noteId)
        }
    }

    const deleteNoteEvent = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        props.deleteNoteEvent()
    }

    return (
        <div className={cn("note", {"not-clicked": !isClicked, "loading": props.isLoading})}
             onClick={noteClickEvent}
             onMouseOver={() => setIsHover(true)}
             onMouseOut={() => setIsHover(false)}
        >

            <DeleteIcon
                type="Note"
                isLoading={props.isLoading}
                callback={deleteNoteEvent}
                isHover={isHover}
            />

            <div className="note-wrapper">
                <div className="note-info">
                    <p ref={noteNameRef} className="note-name"> </p>
                    <p className="note-book"> </p>
                </div>
                <p ref={noteContentRef} className="note-content"> </p>
                <p className="note-time">{props.dateUpdate}</p>
            </div>
        </div>
    )
}

export default withNoteDeleteEvent(withSearchMark(Note))