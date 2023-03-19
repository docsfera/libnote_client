import React, {useEffect, useRef, useState} from 'react'
import Header from "../Header/Header"
import './NoteCreator.sass'
import {gql, useMutation, useQuery} from "@apollo/client"
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {AuthContext} from "../../AuthProvider"
import ButtonQuery from "../ButtonQuery/ButtonQuery"
import {BookType, CurrentNoteType} from "../../types/types"

const GET_ALL_FOLDERS = gql`
    query getAllFolders($userid: ID) {
        getAllFolders(userid: $userid) {
            id
            name
        }
    }
`
const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID) {
        getAllBooks(userid: $userid) {
            id
            name
            image
        }
    }
`
const GET_NOTE_BY_ID = gql`
    query getNoteById($id: ID) {
        getNoteById(id: $id){
            id
            folderid
            bookid
            title
            content
        }
    }
`
const CREATE_NOTE = gql`
      mutation createNote($input: NoteInput) {
        createNote(input: $input){
            id
        }
    }
`
const UPDATE_NOTE = gql`
      mutation updateNote($input: NoteInput) {
        updateNote(input: $input){
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

type NoteCreatorType = {
    isShowHeader?: boolean
    currentNoteData?: CurrentNoteType
    setCurrentNoteData?: any
    book?: BookType
}

const NoteCreator: React.FC<NoteCreatorType> = (props) => {
    //@ts-ignore
    const {userInfo} = React.useContext(AuthContext)
    const navigate = useNavigate()
    const {id} = useParams()
    const { state }: any = useLocation() //TODO: any


    const {data, refetch} = useQuery(GET_NOTE_BY_ID, {variables: {id: id}})
    const allFolders = useQuery(GET_ALL_FOLDERS, {variables: {userid: userInfo.id}}).data
    const dataBooks = useQuery(GET_ALL_BOOKS, {variables: {userid: userInfo.id}}).data

    const [createNote] = useMutation(CREATE_NOTE)
    const [updateNote] = useMutation(UPDATE_NOTE)
    const [updateFolderCountNotes] = useMutation(UPDATE_FOLDER_COUNT_NOTES)


    const [noteName, setNoteName] = useState("Untitled")
    const [noteContent, setNoteContent] = useState("")
    const [beginFolderId, setBeginFolderId] = useState<string | undefined>(undefined)
    const [nameSelectedFolder, setNameSelectedFolder] = useState("")
    const [nameSelectedBook, setNameSelectedBook] = useState("")
    const [idSelectedFolder, setIdSelectedFolder] = useState<string | undefined>(undefined)
    const [idSelectedBook, setIdSelectedBook] = useState<string | undefined>(undefined)


    const [isCreateLoading, setIsCreateLoading] = useState(false)


    const [pathToImageSelectedBook, setPathToImageSelectedBook] = useState<string>("/images/non-found-book.png") // `/files/1/${useGetImageBook(idSelectedBook)}`

    const allFolder = useRef<HTMLDivElement>(null)
    const allBooks = useRef<HTMLDivElement>(null)
    const noteContentRef = useRef<HTMLDivElement>(null)
    const textarea = useRef<HTMLTextAreaElement>(null)

    //Инициализация
    useEffect(() => {
        //Если обрабатывается существующая заметка
        if(data && data.getNoteById && noteContentRef && noteContentRef.current){
            console.log('here')
            noteContentRef.current.innerHTML = data.getNoteById.content
            setNoteName(data.getNoteById.title)
            setNoteContent(data.getNoteById.content)
            setIdSelectedFolder(data.getNoteById.folderid)
            setIdSelectedBook(data.getNoteById.bookid)

            setBeginFolderId(data.getNoteById.folderid)

            // Возможность удаление папки и не обновления данных
            try{
                data.getNoteById.folderid && setNameSelectedFolder(allFolders.getAllFolders.filter((i: any) =>
                    (i.id === data.getNoteById.folderid))[0].name)
                data.getNoteById.bookid && setNameSelectedBook(dataBooks.getAllBooks.filter((i: any) =>
                    (i.id === data.getNoteById.bookid))[0].name)
            }catch (e) {
                console.log("ref", e)
                refetch()
            }


            // idSelectedBook не сразу устанавливается
            if(dataBooks && dataBooks.getAllBooks && (idSelectedBook || data.getNoteById.bookid)) {
                idSelectedBook
                    ? setPathToImageSelectedBook(
                    `/files/${userInfo.id}/${dataBooks.getAllBooks.filter((i:any) => i.id === idSelectedBook)[0].image}`)
                    : setPathToImageSelectedBook(
                    `/files/${userInfo.id}/${dataBooks.getAllBooks.filter((i:any) => i.id === data.getNoteById.bookid)[0].image}`)

            }



        }

        // Если обрабатывается заметка созданная из папки
        if(state && state.folderId){
            console.log('here2', {noteData: props.currentNoteData})
            setIdSelectedFolder(state.folderId)
            setBeginFolderId(state.folderId)
            setNameSelectedFolder(allFolders.getAllFolders.filter((i: any) =>
                (i.id === state.folderId))[0].name)
        }

        // Если обрабатывается заметка pdfViewer
        if(props.currentNoteData) {
            console.log('here3', props.currentNoteData)
            setNoteName(props.currentNoteData.name)
            setNoteContent(props.currentNoteData.content)


            setIdSelectedFolder(props.currentNoteData.folderId)
            if(!beginFolderId){
                setBeginFolderId(props.currentNoteData.folderId)
            }


            if(props.currentNoteData.folderName){
                setNameSelectedFolder(props.currentNoteData.folderName)
            }else{
                if(allFolders?.getAllFolders){
                    const currentFolderId = props.currentNoteData.folderId
                    const folder = allFolders.getAllFolders.filter((i: any) =>
                        (i.id === currentFolderId))[0]
                    folder && setNameSelectedFolder(folder.name)
                }
            }

            //Book

            if(props.book && !props?.currentNoteData?.name){
                setIdSelectedBook(props.book.id)
                setNameSelectedBook(props.book.name)
                setPathToImageSelectedBook(`/files/${userInfo.id}/${props.book.image}`)
            }else{
                setIdSelectedBook(props.currentNoteData.bookId)
                const currentBookId = props.currentNoteData.bookId
                const book = dataBooks.getAllBooks.filter((i: any) =>
                    (i.id === currentBookId))[0]
                if(props.currentNoteData.bookName) { // новая заметка
                    setNameSelectedBook(props.currentNoteData.bookName)
                }else if (dataBooks?.getAllBooks) { // заметка из pdfAside
                    book && setNameSelectedBook(book.name)
                }

                if(dataBooks?.getAllBooks){
                    book?.image && setPathToImageSelectedBook(`/files/${userInfo.id}/${book.image}`)
                }
            }
        }

    }, [data, props])


    useEffect(() => {
        if(noteContentRef?.current && props?.currentNoteData?.content){
            noteContentRef.current.innerHTML = props.currentNoteData.content
        }
    }, [props?.currentNoteData?.content])




    const showAllFolder = () => {
        if(allFolder && allFolder.current) {
            if(allFolder.current.style.cssText == ""){
                allFolder.current.style.display = "block"
            }else{
                if(allFolder.current.style.display === "none"){
                    allFolder.current.style.display = "block"
                }else{
                    allFolder.current.style.display = "none"
                }
            }
        }
    }

    const showAllBooks = () => {
        if(allBooks && allBooks.current) {
            if(allBooks.current.style.cssText == ""){
                allBooks.current.style.display = "block"
            }else{
                if(allBooks.current.style.display === "none"){
                    allBooks.current.style.display = "block"
                }else{
                    allBooks.current.style.display = "none"
                }
            }
        }
    }

    const selectCurrentFolder = (e: React.MouseEvent<Element, MouseEvent>, idSelectedFolder: string, nameSelectedFolder: string) => {
        const {target} = e
        const nameFolder = target ? (target as HTMLDivElement).innerText : " "
        if(allFolder && allFolder.current && props.currentNoteData){
            console.log({nameFolder, idSelectedFolder})
            setNameSelectedFolder(nameFolder)
            setIdSelectedFolder(idSelectedFolder)
            allFolder.current.style.display = "none"

            props.setCurrentNoteData && props.setCurrentNoteData(
                {
                    name: props.currentNoteData.name,
                    content: props.currentNoteData.content,
                    bookId: props.currentNoteData.bookId,
                    bookName: props.currentNoteData.bookName,
                    folderId: idSelectedFolder,
                    folderName: nameSelectedFolder,
                    noteId: props.currentNoteData.noteId,
                }
            )

        }

    }

    const selectCurrentBook = (e: React.MouseEvent<Element, MouseEvent>, idSelectedBook: string, nameSelectedBook: string) => {
        const {target} = e
        const nameBook = target ? (target as HTMLDivElement).innerText : " "
        if (allBooks && allBooks.current && props.currentNoteData) {
            setNameSelectedBook(nameBook)
            setIdSelectedBook(idSelectedBook)
            console.log({idSelectedBook, nameBook})
            allBooks.current.style.display = "none"

            props.setCurrentNoteData && props.setCurrentNoteData(
                {
                    name: props.currentNoteData.name,
                    content: props.currentNoteData.content,
                    bookId: idSelectedBook,
                    bookName: nameSelectedBook,
                    folderId: props.currentNoteData.folderId,
                    folderName: props.currentNoteData.folderName,
                    noteId: props.currentNoteData.noteId,
                }
            )

        }
        if(dataBooks && dataBooks.getAllBooks && idSelectedBook) {
            setPathToImageSelectedBook(
                `/files/${userInfo.id}/${dataBooks.getAllBooks.filter((i:any) => i.id === idSelectedBook)[0].image}`)
        }
    }

    const createNoteEvent = async () => { // TODO: rename
        setIsCreateLoading(true)
        console.log({props, idSelectedFolder, idSelectedBook, id})
        console.log("cond:",id,props.currentNoteData, !id && props.currentNoteData && props.currentNoteData.noteId)
        // props.currentNoteData - Создание новой заметки из pdfViewer
        // !props.currentNoteData - Создание новой заметки из Main
        // id: undefined, props.currentNoteData.noteID:number - Редактирование существующей заметки из pdfViewer

        // props.currentNoteData - Создание новой заметки из pdfViewer
        if ((!id && props.currentNoteData && !props.currentNoteData.noteId) || (!id && !props.currentNoteData)) {
            console.log("whyhere? 2 ", props.currentNoteData, userInfo)
            await createNote(
                {
                    variables: {
                        input: {
                            userid: userInfo.id,
                            folderid: idSelectedFolder,
                            bookid: idSelectedBook,
                            title: (noteName === "") ? "Untitled" : noteName,
                            content: noteContent,
                            datecreate: String(Date.now()),
                            dateupdate: String(Date.now())
                        }
                    }
                }
            ).then(res => {
                console.log({res, props})
                // props.setCurrentNoteData({
                //     name: noteName,
                //     content: noteContent,
                //     bookId: idSelectedBook,
                //     bookName: nameSelectedBook,
                //     folderId: idSelectedFolder,
                //     folderName: nameSelectedFolder,
                //     noteId: res.data.createNote.id
                // })
            })

            } else if (!id && props.currentNoteData && props.currentNoteData.noteId){
                await updateNote(
                    {
                        variables: {
                            input: {
                                id: props.currentNoteData.noteId,
                                userid: userInfo.id,
                                folderid: idSelectedFolder,
                                bookid: idSelectedBook,
                                title: (noteName === "") ? "Untitled" : noteName,
                                content: noteContent,
                                datecreate: String(Date.now()),
                                dateupdate: String(Date.now())
                            }
                        }
                    }
                )
            console.log({beginFolderId, idSelectedFolder})
            if (beginFolderId !== idSelectedFolder) {
                beginFolderId && await updateFolderCountNotes({variables: {folderid: beginFolderId, mode: "-"}})    // TODO: REDO?
                await updateFolderCountNotes({variables: {folderid: idSelectedFolder, mode: "+"}}) // TODO: REDO?
            }

            } else {
            console.log("whyhere?", idSelectedFolder, beginFolderId)
                const noteId = id || props?.currentNoteData?.noteId
                await updateNote(
                    {
                        variables: {
                            input: {
                                id: noteId,
                                userid: userInfo.id,
                                folderid: idSelectedFolder,
                                bookid: idSelectedBook,
                                title: (noteName === "") ? "Untitled" : noteName,
                                content: noteContent,
                                datecreate: String(Date.now()),
                                dateupdate: String(Date.now())
                            }
                        }
                    }
                )


            if (beginFolderId !== idSelectedFolder) {
                beginFolderId && await updateFolderCountNotes({variables: {folderid: beginFolderId, mode: "-"}})    // TODO: REDO?
                await updateFolderCountNotes({variables: {folderid: idSelectedFolder, mode: "+"}}) // TODO: REDO?
            }
            }




        await refetch()
        setIsCreateLoading(false)

        !(props.isShowHeader === false) && navigate(-1)
    }

    const reductStr = (str:string) => {
        if(str ){
            return (str.length > 20) ? `${str.substr(0, 20)}...` : str
        }else{
            return str
        }

    }

    const blurNoteContentEvent = (e: any) => {

        if(textarea?.current){
            const defaultHeight = e.target.clientHeight
            console.log(e.target.value)
            textarea.current.style.height = `${defaultHeight + (e.target.scrollHeight - defaultHeight)}px`
        }
        const content = e.target.value
        console.log({e, textarea})

        setNoteContent(content);
        (props.setCurrentNoteData && props.currentNoteData) && props.setCurrentNoteData(
            {
                name: props.currentNoteData.name,
                content: content,
                bookId: props.currentNoteData.bookId,
                bookName: props.currentNoteData.bookName,
                folderId: props.currentNoteData.folderId,
                folderName: props.currentNoteData.folderName,
                noteId: props.currentNoteData.noteId,
            }
        )
    }
    const blurNoteNameEvent = (htmlContent: string) => {
        setNoteName(htmlContent);
        (props.setCurrentNoteData && props.currentNoteData) && props.setCurrentNoteData(
            {
                name: htmlContent,
                content: props.currentNoteData.content,
                bookId: props.currentNoteData.bookId,
                bookName: props.currentNoteData.bookName,
                folderId: props.currentNoteData.folderId,
                folderName: props.currentNoteData.folderName,
                noteId: props.currentNoteData.noteId,
            }
        )
    }

    const dontUseEnter = (e: any) => (e.key === "Enter") && e.preventDefault()

    const onPasteEvent = (e: any) => {
        //e.preventDefault();
        //const text = e.clipboardData.getData('text/plain')
        //console.log(text, e)
        //setNoteName(e.target.innerText + text)
        //e.returnValue = true
        //document.execCommand('insertText', false, text);

        e.clipboardData.setData('text/plain', 'foo')

        const text = e.clipboardData.getData('text/plain')

        console.log(e.clipboardData)
        console.log({text})

        // e.preventDefault();
        // e.returnValue = true

    }


    const test = (e: any) => {
        if(textarea?.current){
            const defaultHeight = e.target.clientHeight
            console.log(e.target.value)
            textarea.current.style.height = `${defaultHeight + (e.target.scrollHeight - defaultHeight)}px`
        }
    }

    useEffect(() => {
        console.log({noteName})
    },[noteName])

    return (
        <div className="note-creator-wrapper">
            {!(props.isShowHeader === false) && <Header/>}
            <div className="note-creator">
                <div className="note-info">

                    <p className="note-name" contentEditable="true" suppressContentEditableWarning={true}
                       onPaste={(e) => onPasteEvent(e)}
                       onKeyDown={(e) => dontUseEnter(e)}
                       onBlur={(e) => blurNoteNameEvent(e.target.innerText)}>{noteName}</p> {/*TODO: are you sure?*/}

                    {/*<div ref={noteContentRef} className="note-content" contentEditable="true" suppressContentEditableWarning={true}*/}
                    {/*     //onKeyDown={(e) => setNoteName(e.target.innerText)}*/}
                    {/*     onBlur={ (e) => blurNoteContentEvent((e.target.innerHTML))}>*/}


                    {/*</div>*/}

                    <textarea ref={textarea}
                              name="note-content"
                              className="note-content"
                              onChange={(e) => blurNoteContentEvent(e)}>
                    </textarea>


                </div>

                <div className="note-attitude">

                    <div className="folder-info">
                        <p>Папка</p>
                        <div className="select select-folder" onClick={showAllFolder}>{nameSelectedFolder}</div>
                        <div className="all-folders" ref={allFolder}>
                            {allFolders ? allFolders.getAllFolders.map(
                                (i: any) => <div className="select" onClick={(e) =>
                                    selectCurrentFolder(e, i.id, i.name)}> {reductStr(i.name)}</div>) : " "}
                        </div>
                    </div>

                    <div className="book-info">
                        <p>Книга</p>
                        <div className="select select-book" onClick={showAllBooks}>{nameSelectedBook}</div>
                        <div className="all-books" ref={allBooks}>
                            {dataBooks ? dataBooks.getAllBooks.map(
                                (i: any) => <div className="select" onClick={(e) =>
                                    selectCurrentBook(e, i.id, i.name)}> {reductStr(i.name)} </div>) : " "}
                        </div>
                    </div>

                    <img src={pathToImageSelectedBook} alt="" className="image"/>
                    <ButtonQuery
                        type="Create"
                        name="Сохранить"
                        callBack={createNoteEvent}
                        isLoading={isCreateLoading}
                        width={250}
                    />
                </div>


            </div>

        </div>
    );
};

export default NoteCreator;