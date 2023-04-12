import React, { useContext, useEffect, useRef } from 'react'


import { editorSelectionContext } from '../GridAndEditor'

const CellType =({id, type, setSelectedID, selectedID}) => {

 


  const {editorSelection, setEditorSelection} = useContext(editorSelectionContext)
  
  const ref = useRef()


  const select = () => {


  console.log("setting editor seletion to type = ", type)
   setSelectedID(id);
   setEditorSelection(type);

  }
 

  const handleClick = (e) => {

   select();
  }



  useEffect(() => {

   const node =ref.current;
   if(!node)return;

   node.addEventListener('click',handleClick)
   

   return ( () => {

       node.removeEventListener('click',handleClick)
       
   })

  }, [])


  const selected = selectedID == id;
  const className = 'CellType ' + type + (selected? " selected" : "")


  if(type == "none")return (
    <div ref = {ref} className={className}> Erase
     
    </div>
  )


 return (
   <div ref = {ref} className={className}> Set {type.charAt(0).toUpperCase() + type.slice(1)}
    
   </div>
 )
}


export default CellType