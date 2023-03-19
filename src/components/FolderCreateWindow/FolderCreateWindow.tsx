import React, {useEffect, useState} from 'react'
import {gql, OperationVariables, useMutation, ApolloQueryResult} from "@apollo/client"
import "./FolderCreateWindow.sass"
import {AuthContext} from "../../AuthProvider"
import ButtonQuery from "../ButtonQuery/ButtonQuery"
import {FolderType} from "../../types/types"

const CREATE_FOLDER = gql`
    mutation createFolder($input: FolderInput){
        createFolder(input: $input) {
            id
        }
    }
`

type FolderCreateWindowType = {
    setIsShowFolderCreator: React.Dispatch<React.SetStateAction<boolean>>
    refetch: (variables?: (Partial<OperationVariables> | undefined))
        => Promise<ApolloQueryResult<{getAllFolders: FolderType[]}>>
}

const FolderCreateWindow: React.FC<FolderCreateWindowType> = (props) => {
    const {hideSmokeWindow, showSmokeWindow, userInfo} = React.useContext(AuthContext)
    const [nameCreatedFolder, setNameCreatedFolder] = useState("")
    const [isCreateLoading, setIsCreateLoading] = useState(false)

    const [createFolder] = useMutation(CREATE_FOLDER)

    useEffect(() => {
        showSmokeWindow()
    },[])

    const exitFromCreateFolderWindow = () => {
        props.setIsShowFolderCreator(false)
        hideSmokeWindow()
        setNameCreatedFolder("")
    }

    const createFolderEvent = async () => {
        setIsCreateLoading(true)
        await createFolder(
            {
                variables: {
                    input: {
                        userid: userInfo.id,
                        name: nameCreatedFolder,
                        countofnotes: 0
                    }
                }
            })
        props.setIsShowFolderCreator(false)
        hideSmokeWindow()
        setNameCreatedFolder("")
        setIsCreateLoading(false)
        props.refetch()
    }

    return (
        <div className="folder-create-window">
            <div className="exit-icon" onClick={exitFromCreateFolderWindow}> </div>
            <p className="name-window">Создать папку</p>
            <p className="name-folder">Название папки</p>
            <input type="text"
                       className="input-name-folder"
                       placeholder="Введите название папки"
                       value={nameCreatedFolder}
                       onChange={(e) => setNameCreatedFolder(e.target.value)}
            />
            <div className="buttons">
                <ButtonQuery type="Exit" width={150} name="Отмена" callBack={exitFromCreateFolderWindow}/>
                <ButtonQuery
                    type="Create"
                    width={150}
                    name="Создать"
                    callBack={createFolderEvent}
                    isLoading={isCreateLoading}
                />
            </div>
        </div>
    )
}

export default FolderCreateWindow