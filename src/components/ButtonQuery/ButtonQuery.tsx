import React from 'react'
import styled from "styled-components"



type ButtonSaveType = {
    type: "Create" | "Exit"
    width: number
    name: string
    callBack: any
    isLoading?: boolean
}

const ButtonQuery: React.FC<ButtonSaveType> = (props) => {
    const getBackGround = () => {
        if(props.type === "Exit"){
            return "#FD3162"
        }
        if(props.type === "Create"){
            return (props.isLoading) ? "#0053AC" : "#007BFF"
        }
    }
    const getHoverBackGround = () => (props.type === "Create") ? "#005DC1" : "#CB274D"

    // TODO: font-family ect?????
    const Button = styled.button<{width: number, isLoading: boolean | undefined}>`
      align-self: center;
      width: ${props => props.width}px;
      height: 40px;
      border-radius: 5px;
      font-size: 1em;
      border: none;
      font-weight: 600;
      color: ${props => props.isLoading ? "#C4C4C4" : "#F8F9FA"};
      cursor: pointer;
      transition: .5s;
      pointer-events: ${props => props.isLoading ? "none" : "auto"};
      background: ${getBackGround()};
      &:hover {
        transition: .5s;
        background: ${getHoverBackGround()};
      }
    `

    return (
        <Button width={props.width} isLoading={props.isLoading} onClick={props.callBack}>
            {props.name}
        </Button>
    )
}

export default ButtonQuery