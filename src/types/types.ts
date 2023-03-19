export type FolderType = {
    id: string
    userid: string
    name: string
    countofnotes: number
}
export type BookType = {
    id: string
    name: string
    utfname: string
    image: string
}
export type NoteType = {
    id: string
    title: string
    folderid: string
    bookid: string
    content: string
    datecreate: string
    dateupdate: string
}
export type CurrentNoteType = {
    name: string,
    content: string,
    bookId: string | undefined,
    bookName: string | undefined,
    folderId: string | undefined,
    folderName: string | undefined,
    noteId: string | undefined
}


export default {}