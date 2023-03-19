import React, {useEffect, useRef} from 'react'
import "./Book.sass"
import withSearchMark from "../../HOC/withSearchMark"
import {BookType} from "../../types/types"

type BookComponentType = {
    book: BookType
    userId: string
    navigateViewer: (book: BookType) => void
    showBookSettings: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, bookId: string) => void
    searchWord?: string
    insertMarkHTML: (componentName: string, searchWord: string | undefined) => string
}

const Book: React.FC<BookComponentType> = (props) => {
    const bookNameRef = useRef<HTMLParagraphElement>(null)
    useEffect(() => {
        if(bookNameRef && bookNameRef.current){
            bookNameRef.current.innerHTML = props.insertMarkHTML(props.book.name, props.searchWord)
        }
    }, [props])

    return (
        <div className="book" onClick={() => props.navigateViewer(props.book)}>
            <img src="/images/book-settings.png"
                 className="book-settings"
                 onClick={e => props.showBookSettings(e, props.book.id)}
            />

            {props.book.image
                ? <img src={`/files/${props.userId}/${props.book.image}`} alt="" className="image"/>
                :  <img src={"/images/non-found-book.png"} alt="" className="image"/>
            }

            <p ref={bookNameRef} className="book-name">{props.book.name}</p>
        </div>
    )
}

export default withSearchMark(Book)