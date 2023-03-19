import React from 'react'
import "./ButtonCreate.sass"

type ButtonCreateType = {
    name: string
    onClick: () => void
}

const ButtonCreate: React.FC<ButtonCreateType> = (props) => {
    return (
        <button className="button-create" onClick={props.onClick}>
            {props.name}
        </button>
    )
}

export default ButtonCreate