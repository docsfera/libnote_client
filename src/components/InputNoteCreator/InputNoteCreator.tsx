import React, {useRef} from 'react'
import "./InputNoteCreator.sass"
import {useMutation, gql, useQuery} from '@apollo/client'
import {isContentEditable} from "@testing-library/user-event/dist/utils"

const CREATE_NOTE = gql`
      mutation createNote($input: NoteInput) {
        createNote(input: $input){
            content
        }
    }
`

const InputNoteCreator = (props: any) => { // todo: fix
    const noteContent = useRef<HTMLInputElement>(null)
    const [createNote, { loading, data, error }] = useMutation(CREATE_NOTE)

    const createNoteEvent = async () => {
        if (noteContent.current && noteContent.current.value){
            const content = noteContent.current.value
            noteContent.current.value = ""
            let now = new Date()

            await createNote({ variables: { input: {
                        userid: "1",
                        title: "title",
                        content,
                        datecreate: `${+now}`,
                        dateupdate: `${+now}`
                    }}})
            await props.refetch()
        }else {
            throw new Error("Cannot create this note")
        }
    }
    return (
        <div className="input-note-creator">
            <input ref={noteContent} type="text" className="input-field"/>
            <button className="input-button" onClick={() => createNoteEvent()}>
                <img src="/images/inputPlus.svg" alt=""/>
            </button>
        </div>
    )
}

export default InputNoteCreator