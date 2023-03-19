export const getPathToNoteCreate = (noteId? :string): string => {
    let path: string
    noteId ? path = `/note-creator/${noteId}` : path = `/note-creator`
    return path
}

export default {}