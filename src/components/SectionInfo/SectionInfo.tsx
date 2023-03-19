import React from 'react'
import "./SectionInfo.sass"
import {NavLink} from "react-router-dom"

type SectionInfoType = {
    nameSection: "Books" | "Notes" | "Folders"
    sectionCount: number | string
    isLink?: true
}

const SectionInfo: React.FC<SectionInfoType> = (props) => {

    const nameSectionRu = {
        Books: ["Книги", "книг"],
        Notes: ["Заметки", "заметок"],
        Folders: ["Папки", "папок"]
    }

    return (
        <div className="section-info">
            {props.isLink
                ? <NavLink to={props.nameSection.toLowerCase()} className="name-section link">{nameSectionRu[props.nameSection][0]}</NavLink>
                : <p className="name-section">{nameSectionRu[props.nameSection][0]}</p>}
            <p className="section-count">{`Всего ${nameSectionRu[props.nameSection][1]}: ${props.sectionCount}`}</p>
        </div>
    )
}

export default SectionInfo