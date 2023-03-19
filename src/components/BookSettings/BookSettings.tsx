import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom"
import "./BookSettings.sass"
import {gql, useMutation, useQuery} from "@apollo/client"
import Header from "../Header/Header"
import {AuthContext} from "../../AuthProvider"
import ButtonQuery from "../ButtonQuery/ButtonQuery"

const GET_BOOK_BY_ID = gql`
    query getBookById($id: ID){
        getBookById(id: $id){
            id
            name
            utfname
            image
        }
    }
`

const GET_NOTES_BY_BOOK_ID = gql`
    query getNotesByBookId($id: ID){
        getNotesByBookId(id: $id){
            id
        }
    }
`
const DELETE_BOOK_BY_ID = gql`
    mutation deleteBookById($id: ID, $userId: ID){
        deleteBookById(id: $id, userId: $userId) {
            id
        }
    }
`
const UPDATE_BOOK_NAME = gql`
    mutation updateBookName($id: ID, $name: String){
        updateBookName(id: $id, name: $name) {
            id
        }
    }
`

const BookSettings = () => {
    const {userInfo} = React.useContext(AuthContext)

    const navigate = useNavigate()
    const {id} = useParams()
    const {data, refetch} = useQuery(GET_BOOK_BY_ID, {variables:{ id }})
    const notesByBookIdQuery = useQuery(GET_NOTES_BY_BOOK_ID, {variables:{ id }})
    const notesByBookIdData = notesByBookIdQuery.data
    const [deleteBookById] = useMutation(DELETE_BOOK_BY_ID)
    const [updateBookName] = useMutation(UPDATE_BOOK_NAME)

    // TODO: 3 render?
    const [bookName, setBookName] = useState("")
    const [bookNameUTF, setBookNameUTF] = useState("")
    const [bookImageName, setBookImageName] = useState("")

    const [isLoadingUpdateBook, setIsLoadingUpdateBook] = useState(false)

    useEffect(() => {
        if(data && data.getBookById){
            setBookName(data.getBookById.name)
            setBookNameUTF(data.getBookById.utfname)
            setBookImageName(data.getBookById.image)
            notesByBookIdQuery.refetch()
        }
    }, [data])

    const deleteBookByIdEvent = async () => {
        await deleteBookById({variables: { id, userId: userInfo.id}})
        navigate("../books")
    }
    const updateBookEvent = async () => {
        setIsLoadingUpdateBook(true);
        (data.getBookById.name !== bookName) && await updateBookName({variables: {id, name: bookName}})
        setIsLoadingUpdateBook(false)
        navigate("../books")
    }
    const getCountNotesByBook = () => {
        return (notesByBookIdData && notesByBookIdData.getNotesByBookId) ? notesByBookIdData.getNotesByBookId.length : 0
    }

    return (
        <div className="book-settings-component">
            <Header/>
            <div className="book-settings-wrapper">

                <div className="book-settings">
                    <h2>Редактирование книги</h2>
                    <div className="count-notes-delete-book">
                        <p className="delete-book" onClick={deleteBookByIdEvent}>Удалить книгу</p>
                        <p className="count-notes" onClick={deleteBookByIdEvent}>
                            {`Заметок по книге: ${getCountNotesByBook()}`}
                        </p>
                    </div>

                    <p className="book-name">Название книги</p>
                    <input type="text" className="book-name-input" value={bookName} onChange={(e) => setBookName(e.target.value)}/>
                    <p className="book-name">Имя книги на сервере</p>
                    <input type="text" className="book-name-input" placeholder={bookNameUTF} readOnly/>
                    <div className="buttons">
                        <ButtonQuery
                            type="Exit"
                            width={150}
                            name="Отмена"
                            callBack={() => navigate(-1)}
                        />
                        <ButtonQuery
                            type="Create"
                            width={150}
                            name="Сохранить"
                            callBack={updateBookEvent}
                            isLoading={isLoadingUpdateBook}
                        />
                    </div>
                </div>

                <div className="book-image">
                    <img className="image"
                         src={`/files/${userInfo.id}/${bookImageName}`}
                         alt=""
                         onClick={() => navigate(`../pdf-viewer/${userInfo.id}`, {state: {name: bookNameUTF}})}/>
                    <p className="change-book-image" onClick = {() => alert('Функция в разработке!')}>Сменить обложку</p>
                </div>

            </div>
        </div>

    )
}

export default BookSettings