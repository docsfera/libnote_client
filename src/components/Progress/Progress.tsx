import React, {FC} from 'react'
import styled from "styled-components"

const StyledProgress = styled.progress<any>`
  display: block;
  height: 7px;
  width: 220px;
  color: red;
  background-color: #FFF;
  padding: 0;
  margin: auto;

  &:after {
    display: block;
    content: " ";
    width: 2px;
    height: 10px;
    position: relative;
    left: ${(props: { value: number; }) => props.value * 2.2 - 2}px;
    background: #838383;
  }
  
  &::-webkit-progress-bar{
  
    background-color: #484848;
    }

&::-webkit-progress-value{
    background-color: #838383;
    }
    
`;

const ParagraphProgress = styled.p<any>`
    color:red;
    display: block;
    position: relative;
    left: ${(props: { value: number; }) => props.value * 2.2 + 13}px;
    top: 10px;

`

type ProgressProps = {
    max: number
    value: number
}

const Progress: FC<ProgressProps> = ((props) => {
    return (
        <>
            <StyledProgress max={props.max} value={props.value}/>
            <ParagraphProgress value={props.value}>{props.value}</ParagraphProgress>
        </>
    )
})

export default Progress