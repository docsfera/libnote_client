import React, {useRef, useState} from 'react'
import "./NewBooks.sass"
import {useNavigate} from "react-router-dom"
import {gql, useQuery} from "@apollo/client"
import Arrow from "../Arrow/Arrow"
import {AuthContext} from "../../AuthProvider"
import SectionInfo from "../SectionInfo/SectionInfo"
import {BookType} from "../../types/types"

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

const NewBooks = () => {
    const navigate = useNavigate()
    const {userInfo} = React.useContext(AuthContext)
    const {data, loading} = useQuery<{getAllBooks: BookType[]}>(GET_ALL_BOOKS, {variables:{userid: userInfo.id}})

    let [position, setPosition] = useState(0)
    const booksContainer = useRef<HTMLDivElement>(null)
    const bookSection = useRef<HTMLDivElement>(null)
    const bookWidth = 100
    let bookCount: number
    data ? bookCount = data.getAllBooks.length : bookCount = 0


    const clickEvent = (book: BookType) => navigate(`/pdf-viewer/${userInfo.id}`, {state: { book }})

    return (
        <div className="folders-section" ref={bookSection}>
            <SectionInfo nameSection="Books" sectionCount={loading ? "..." : bookCount} isLink={true}/>
            <div className="folders">
                    <Arrow sectionContainer={booksContainer?.current}
                    position={position}
                    elementWidth={bookWidth}
                    setPosition={setPosition}
                    currentSection={bookSection?.current}
                    sectionCount={bookCount}
                    isLeftArrow={true}
                    maxCountToShow={1}
                    />

                <div className="folders-container">
                    <div ref={booksContainer} className="itemser">

                        {loading &&
                            <>
                                <div className="book-skeleton"> </div>
                                <div className="book-skeleton"> </div>
                                <div className="book-skeleton"> </div>
                                <div className="book-skeleton"> </div>
                            </>
                        }

                        {data?.getAllBooks.map( (i) =>
                            i.image
                                ? <img src={`/files/${userInfo.id}/${i.image}`}
                                       alt=""
                                       key={i.id}
                                       className="image"
                                       onClick={ () => clickEvent(i) }/>

                                : <img src="/images/non-found-book.png" /// todo: another component
                                       alt=""
                                       key={i.id}
                                       className="image"
                                       onClick={ () => clickEvent(i) }/>
                        )}
                    </div>
                </div>
                <Arrow sectionContainer={booksContainer?.current}
                       position={position}
                       elementWidth={bookWidth}
                       setPosition={setPosition}
                       currentSection={bookSection?.current}
                       sectionCount={bookCount}
                       isLeftArrow={false}
                       maxCountToShow={1}
                />
            </div>
        </div>
    )
}

export default NewBooks