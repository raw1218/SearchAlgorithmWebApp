import React, { useContext, useEffect, useRef } from 'react'
import { editorSelectionContext } from '../ForceGraphAndEditor'



const NodeType = ({id, type, setSelectedID, selectedID}) => {

 


   const {editorSelection, setEditorSelection} = useContext(editorSelectionContext)
   
   const ref = useRef()


   const select = () => {


    setSelectedID(id);
    setEditorSelection(type)

   }
  

   const handleClick = (e) => {
    console.log("handling click");

    select();
   }



   useEffect(() => {

    const node =ref.current;
    if(!node)return;

    node.addEventListener('click',handleClick)
    
    return ( () => {

        node.removeEventListener('click',handleClick)
        
    })

   }, [handleClick])


   const selected = selectedID == id;
   const className = "NodeType " + type + (selected? " selected" : "")


  return (
    <div ref = {ref} className={className}>Set {type.charAt(0).toUpperCase() + type.slice(1)}</div>
  )
}

export default NodeType