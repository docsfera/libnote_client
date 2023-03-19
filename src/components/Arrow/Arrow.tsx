import React, {useRef} from 'react'
import "./Arrow.sass"

type ArrowType = {
    sectionContainer: HTMLDivElement | null
    setPosition:  React.Dispatch<React.SetStateAction<number>>
    position: number
    elementWidth: number
    currentSection: HTMLDivElement | null
    sectionCount: number
    isLeftArrow: boolean // TODO: mb 2 constant "left" and "right"
    maxCountToShow: number
}

const Arrow: React.FC<ArrowType> = (props) => {

    console.log({props})

    const currentArrow = useRef<HTMLButtonElement>(null)

    const plus = () => {
        let newPosition = (props.isLeftArrow) ? props.position - props.elementWidth : props.position + props.elementWidth
        checkButtons(newPosition)
        props.setPosition(newPosition)
        if(props.sectionContainer) {
            props.sectionContainer.style.transition = "0.5s"
            props.sectionContainer.style.transform = `translateX(-${newPosition}px)`
        }
    }

    const checkButtons = (position: number) => { // TODO: check this
        if(props.currentSection && currentArrow.current){
            if(props.isLeftArrow){
                ( props.position === 0) ? currentArrow.current.style.display = "none" : currentArrow.current.style.display = "block";
            }else{
                if(props?.currentSection.offsetWidth > props.elementWidth * props.sectionCount){
                    currentArrow.current.style.display = "none"
                }else{
                    (props.position >= (props.sectionCount - props.maxCountToShow) * props.elementWidth) ?
                        currentArrow.current.style.display = "none" :
                        currentArrow.current.style.display = "block"
                }
            }
        }
    }

    props?.currentSection && checkButtons(0)

    return (
        <button
            className={`arrow ${props.isLeftArrow ? "left-arrow" : "right-arrow"}`}
            onClick={plus}
            ref={currentArrow}>
        </button>
    )
}

export default Arrow