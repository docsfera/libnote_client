import React, {useEffect, useRef, useState} from 'react'
import "./Books.sass"
import Header from "../Header/Header";
import {gql, useMutation, useQuery} from "@apollo/client"
import {NavLink, useNavigate} from "react-router-dom"
import Book from "../Book/Book";
import CyrillicToTranslit from "cyrillic-to-translit-js"
import SectionInfo from "../SectionInfo/SectionInfo"
import {BookType} from "../../types/types"
import {AuthContext} from "../../AuthProvider"
import withAside from "../../HOC/withAside"

const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")

const GET_ALL_BOOKS = gql`
    query getAllBooks($userid: ID){
        getAllBooks(userid: $userid){
            id
            name
            utfname
            image
        }
    }
`

const SAVE_BASE_64 = gql`
    mutation($base64: String, $bookId: ID, $userId: ID){
        saveBase64(base64: $base64, bookId: $bookId, userId: $userId) {
            id
        }
    }
`

const Books = () => {
    const navigate = useNavigate()
    //@ts-ignore
    const cyrillicToTranslit = new CyrillicToTranslit()
    const {userInfo} = React.useContext(AuthContext)
    const {data, loading} = useQuery<{getAllBooks: BookType[]}>(GET_ALL_BOOKS,
        {variables:{userid:userInfo.id}, pollInterval: 500})
    const [saveBase64] = useMutation(SAVE_BASE_64)

    const [isBookLoading, setIsBookLoading] = useState(false)

    const refCanvas = useRef(null)
    const smokeWindow = useRef<HTMLDivElement>(null) // TODO: create component

    let booksCount: number
    data?.getAllBooks ? booksCount = data.getAllBooks.length : booksCount = 0

    const [searchWord, setSearchWord] = useState("")

    useEffect(() => {
        if(smokeWindow && smokeWindow.current){
            smokeWindow.current.style.height = `${smokeWindow.current.ownerDocument.body.offsetHeight}px`
        }
    },[smokeWindow, smokeWindow.current])

    useEffect(() => {
        if(data && data.getAllBooks) {
            data.getAllBooks.map((i: any, index: any) => {
                if (!i.image) {
                    let bookUrl = `http://localhost:3000/files/${userInfo.id}/${i.utfname}`
                    setCanvas(refCanvas, bookUrl, i.id)
                }
            })
        }
    }, [data, refCanvas])

    const setCanvas = (refCanvas: any, bookUrl: string, bookId: string) => {
        setIsBookLoading(false)
        const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL//"https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        let loadingTask = pdfjsLib.getDocument(bookUrl)

        loadingTask.promise.then((pdfDocument: any) => {
            pdfDocument.getPage(1).then((page: any) => {
                let scale = 555
                let viewport = page.getViewport(scale)
                let canvas = refCanvas.current
                if (canvas) {
                    let context = canvas.getContext('2d');
                    viewport.height = canvas.height
                    viewport.width = canvas.width
                    let renderContext = {canvasContext: context, viewport: viewport}
                    let renderTask = page.render(renderContext)

                    renderTask.promise.then(async () => {
                        let base64image = canvas.toDataURL("image/png")
                        await saveBase64({variables: {base64: base64image, bookId: bookId, userId: userInfo.id} })
                        // html2canvas(document.getElementById("pageContainer")).then((canvas) => {
                        //     let base64image = canvas.toDataURL("image/png")
                        // })
                    })
                }
            })
        })
    }

    const navigateViewer = (book: BookType) => {
        navigate(`../pdf-viewer/${userInfo.id}`, {state: {book}}) // TODO: useQuery(getBookByID)???
    }

    const uploadFile = (file: any) => {
        setIsBookLoading(true)
        let formData = new FormData()

        const UTFName = cyrillicToTranslit.transform(file.name, "_")
        formData.append('file', file)
        formData.append('fileName', file.name)
        formData.append('userId', userInfo.id)
        formData.append('UTFName', UTFName)

        fetch('/', { // TODO: updating page!!!!
            method: 'POST',
            body: formData
        })

    }

    const changeUploadFile = (e: any) => {
        e.preventDefault()
        if(e.dataTransfer){
            if(e.dataTransfer.files[0].type === "application/pdf"){
                console.log()
                uploadFile(e.dataTransfer.files[0])
            }else{
                (dropArea && dropArea.current) && dropArea.current.classList.add('error')
            }
        }else{
            uploadFile(e.target.files[0])
        }
    }

    const dropArea = useRef<HTMLDivElement>(null)

    const go = () => (dropArea && dropArea.current) && dropArea.current.classList.add('highlight')
    const gone = () => (dropArea && dropArea.current) && dropArea.current.classList.remove('highlight')

    const showBookSettings = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, bookId: string) => {
        e.stopPropagation()
        navigate(`../book-settings/${bookId}`)
    }

    const condition = (book: any, searchWord: string) => {
        if(book.name.toLowerCase().includes(searchWord.toLowerCase())){
            return book
        }
    }

    return (
        <div>
            <Header setSearchWord={setSearchWord} searchWord={searchWord} isShow={true}/>
            <div className="books-container">
                <SectionInfo nameSection="Books" sectionCount={loading ? "..." : booksCount}/>

                <div className="books">
                    {data && data.getAllBooks.filter((i) => condition(i, searchWord)).map((i) =>
                        <Book
                            key={i.id}
                            book={i}
                            userId={userInfo.id}
                            navigateViewer={navigateViewer}
                            showBookSettings={showBookSettings}
                            searchWord={searchWord}
                        />)
                    }

                    {isBookLoading && <div className="book-skeleton"> </div>}
                    {loading &&
                        <>
                            <div className="book-skeleton"> </div>
                            <div className="book-skeleton"> </div>
                            <div className="book-skeleton"> </div>
                        </>
                    }



                    <div id="drop-area"
                         ref={dropArea}
                         onDragEnter={go}
                         onDragOver={go}
                         onDragLeave={gone}
                         onDrop={(e) => {gone(); changeUploadFile(e)}}>

                        <input type="file" id="fileElem" accept="application/pdf" onChange={(e) => changeUploadFile(e)}/>
                    </div>
                </div>
                <canvas ref={refCanvas} width="570" height="760" className="canvas"></canvas>
            </div>
        </div>
    )
}

export default withAside(Books)