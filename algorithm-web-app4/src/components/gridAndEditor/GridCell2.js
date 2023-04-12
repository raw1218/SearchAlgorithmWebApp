import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import "./Grid.css";


import { editorSelectionContext } from './GridAndEditor';




const GridCell = forwardRef(({id,  rotated},ref) => {

    
 

    const [type, setType] = useState("none")
    const [hovered,setHovered] = useState(false)
    const [leftBorder, setLeftBorder] = useState(true);
    const [rightBorder,setRightBorder] = useState(true);
    const [topBorder,setTopBorder] = useState(true)
    const [bottomBorder,setBottomBorder]  = useState(true)
  

    const {editorSelection,setEditorSelection} = useContext(editorSelectionContext)

    const removeBorder = (d) => {
        if(d == "top")setTopBorder(false);
        if(d == "bottom")setBottomBorder(false);
        if(d == "left")setLeftBorder(false);
        if(d == "right")setRightBorder(false);
    }

    const resetBorders = ()=> {
        setTopBorder(true);
        setBottomBorder(true);
        setLeftBorder(true);
        setRightBorder(true);
    }
  



    var color;

    if(type == "start"){
        color = "green";
    }
    if(type == "end"){
        color = "red"
    }
    if(type == "obstacle"){
        color = "black"
    }
    if(type == "none"){
        color = "#FFFFF3"
      
    }

    if(type == "visited"){
        color = "#ccc"
        
    }

    if(hovered && type != editorSelection)color ="#00D9C0"
    if(hovered && (type == "obstacle" || "none"))color = "#00D9C0"

    const shouldBorder = (type != "none" && type != "visited")
    const style = {
        backgroundColor: color,
        borderLeft: (!leftBorder && !rotated) || (!bottomBorder && rotated) || shouldBorder ? "none" : "",
        borderRight: (!rightBorder && !rotated) || (!topBorder && rotated) || shouldBorder? "none" : "",
        borderTop: (!topBorder && !rotated) || (!leftBorder && rotated) || shouldBorder ?  "none": "",
        borderBottom: (!bottomBorder && !rotated) || (!rightBorder && rotated)  || shouldBorder? "none" : "",
        borderColor: (type == "visited"? "":""),
      
      };




    useImperativeHandle(ref,
      () => {
        return {setType: setType,
                getType: ()=>{return type},
                setHovered:setHovered,
                removeBorder:removeBorder,
                resetBorders:resetBorders,
               
            }
      },
      [type],
    )


    return <div className='grid-cell'  style = {style}></div>


});


export default GridCell;