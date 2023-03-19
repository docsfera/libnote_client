import React, {useEffect, useRef, useState} from 'react'
import "./PdfViewer.sass"
import {useLocation, useParams, useNavigate} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import * as cn from "classnames"


import "./pdf_viewer.css"
import NoteCreatorComponent from "../NoteCreatorComponent/NoteCreatorComponent";
import PdfAside from "../PdfAside/PdfAside";
const pdfjsLib = require("pdfjs-dist/build/pdf")
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer")

const GET_BOOK_BY_ID = gql`
    query getBookById($id: ID){
        getBookById(id: $id){
            id
         
        }
    }
`

// type NoteData = {
//     name: string
//
// }


const PdfViewer = () => {
    const navigate = useNavigate()
    const {userId} = useParams()
    const { state } = useLocation() //TODO: any
    console.log({state})

    const [isShowAside, setIsShowAside] = useState(false)
    const [isShowNoteCreator, setIsShowNoteCreator] = useState(false)

    const [currentNoteData, setCurrentNoteData] = useState(
        {
            name: "Untitled",
            content: "",
            bookId: undefined,
            bookName: undefined,
            folderId: undefined,
            folderName: undefined,
            noteId: undefined
        })


    const containerRef = useRef(null)
    const refPdfViewer = useRef(null)
    const [isShowSmokeWindow, setIsShowSmokeWindow] = useState(false)

    //const {data} = useQuery(GET_BOOK_BY_ID, {variables: {id}} )

    useEffect(() => {
        //window.addEventListener('scroll', scrollEvent) // срабатывал event при переходе на main
        if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
            alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
        }

        const container = containerRef.current
        const WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL //"https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js"
        const CMAP_URL = "node_modules/pdfjs-dist/cmaps/" //"pdfjs-dist/cmaps/"
        const CMAP_PACKED = true
        //let DEFAULT_URL = "../../files/somefile5.pdf"
        //console.log((data && data.getBookById) && `http://localhost:3000/files/${id}/${data.getBookById.name}`)

        let DEFAULT_URL = `http://localhost:3000/files/${userId}/${state.book.utfname}`
        const SEARCH_FOR = ""; // try 'Mozilla'
        const eventBus = new pdfjsViewer.EventBus()

        // (Optionally) enable hyperlinks within PDF files.
        const pdfLinkService = new pdfjsViewer.PDFLinkService({
            eventBus: eventBus,
        });

// (Optionally) enable find controller.
        const pdfFindController = new pdfjsViewer.PDFFindController({
            eventBus: eventBus,
            linkService: pdfLinkService,
        });

        const pdfViewer = new pdfjsViewer.PDFViewer({
            //@ts-ignore
            container: container,
            eventBus: eventBus,
            linkService: pdfLinkService,
            findController: pdfFindController,
        });


        pdfLinkService.setViewer(pdfViewer);
// @ts-ignore
        refPdfViewer.current = pdfViewer

        eventBus.on("pagesinit", function () {
            // We can use pdfViewer now, e.g. let's change default scale.
            pdfViewer.currentScaleValue = "auto"; //

            // We can try searching for things.
            if (SEARCH_FOR) {
                //@ts-ignore
                pdfFindController.executeCommand("find", { query: SEARCH_FOR });
            }
        });

// Loading document.
        const loadingTask = pdfjsLib.getDocument({
            url: DEFAULT_URL,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        });
        loadingTask.promise.then(function (pdfDocument) {
            // Document loaded, specifying document for the viewer and
            // the (optional) linkService.
            pdfViewer.setDocument(pdfDocument)
            pdfLinkService.setDocument(pdfDocument, null)

            let numPages = pdfDocument.numPages // кол-во страниц

            // pdfjsLib.renderTextLayer({
            //     textContent: textContent,
            //     container: $("#text-layer").get(0),
            //     viewport: viewport,
            //     textDivs: []
            // })

            pdfDocument.getPage(1).then(function (page) {
                let scale = 1.5;
                let viewport = page.getViewport(scale);

                // console.log("here")
                //
                // textLayer.current.style.height = `${viewport.height}px`
                // textLayer.current.style.width = `${viewport.width}px`
                //     height : viewport.height+'px',
                //     width : viewport.width+'px',
                //     top : canvasOffset.top,
                //     left : canvasOffset.left
                // });

                page.getTextContent().then(function(textContent){



                    console.log(page.getTextContent())
                    // if(textLayer2 && textLayer2.current){
                    //     let textLayer = new TextLayerBuilder({
                    //         eventBus: eventBus,
                    //         textLayerDiv: textLayer2.current,
                    //         pageIndex: 1,
                    //         viewport: viewport
                    //     });
                    //
                    //     // Set text-fragments
                    //     textLayer.setTextContent(textContent);
                    //
                    //     // Render text-fragments
                    //     textLayer.render();
                    //
                    // }




                    // console.log(textContent)
                    //
                    // pdfjsLib.renderTextLayer({
                    //     textContent: textContent,
                    //     container: textLayer.current,
                    //     viewport: viewport,
                    //     textDivs: []
                    // });

                    // let textLayer = new TextLayerBuilder({
                    //     viewport : viewport
                    // });
                    // console.log(textContent)
                    // textLayer.setTextContent(textContent);
                    // textLayer.render();

                })
            })


        });






    }, [containerRef])

    const getAsideEvent = () => {



        // if(getterAside && getterAside.current) {
        //     if(getterAside.current.style.right === "20px"){
        //         getterAside.current.style.right = "100px"
        //     }else{
        //         getterAside.current.style.right = "20px"
        //     }
        //
        // }
    }

    const onCopyEvent = (e) => {
        console.log({e, text: e.clipboardData.getData('text')})

        //e.target.outerHTML = e.target.innerText
        console.log(window.getSelection())
        //e.clipboardData.setData('text/plain', 'foo')
    }


    return (
        <>

            <div ref={containerRef} id="viewerContainer" >
                <div id="pageContainer" className="pdfViewer" onCopy={(e) => onCopyEvent(e)} onSelect={(e) => console.log({select: e})}> </div>
            </div>

            <div className="exit fixed-button" onClick={() => navigate(-1)}> </div>
            <div className={cn("getter-aside", "fixed-button", {"getter-aside-active": isShowAside})}
                 onClick={() => setIsShowAside(!isShowAside)}> </div>
            .book-aside-active
            <div className="getter-note-creator fixed-button" onClick={() => {
                setIsShowNoteCreator(!isShowNoteCreator)
                setIsShowSmokeWindow(!isShowSmokeWindow)
            }}>
                <img src="../../../images/PdfNote.png" alt=""/>

            </div>

            <PdfAside isShowAside={isShowAside}
                      isShowNoteCreator={isShowNoteCreator}
                      isShowSmokeWindow={isShowSmokeWindow}
                      currentNoteData={currentNoteData}
                      setIsShowAside={setIsShowAside}
                      setIsShowNoteCreator={setIsShowNoteCreator}
                      setCurrentNoteData={setCurrentNoteData}
                      setIsShowSmokeWindow={setIsShowSmokeWindow}
                      userId={userId}/>

            {isShowNoteCreator &&
            <NoteCreatorComponent
                id={userId}
                currentNoteData={currentNoteData}
                setCurrentNoteData={setCurrentNoteData}
                book={state.book}
            />}

            {isShowSmokeWindow && <div className="smoke"> </div>}

        </>
    )
}

export default PdfViewer