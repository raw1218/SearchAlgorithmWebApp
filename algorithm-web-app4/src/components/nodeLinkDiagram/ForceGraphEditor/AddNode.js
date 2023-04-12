import React, {useRef,useEffect, useContext} from 'react'
import './ForceGraphEditor.css'
import { editorSelectionContext } from '../ForceGraphAndEditor'
const AddNode = ({id,setSelectedID,selectedID}) => {


  const ref = useRef()

  const {editorSelection, setEditorSelection} = useContext(editorSelectionContext)


  const select = () => {
    console.log("")
    setSelectedID(id)
    setEditorSelection('addNode')
    console.log("setEditorselection to")}

  //event listeners

  const handleClick = () => {
    select();
  }
  
  const handleTouchEnd = () => {
    select();
  }

  useEffect(() => {
    
    const component = ref.current;
    if(!component)return;

    component.addEventListener('click', handleClick)
    component.addEventListener('touchend', handleTouchEnd)

  
    return () => {
      component.removeEventListener('click',handleClick)
      component.removeEventListener('touchend',handleTouchEnd)
    }
  }, [handleClick])
  

  const selected = id == selectedID;
  const className = "EditGraph " + (selected? "selected" : "") 

  return (

    <div className = {className} ref = {ref}>Add Node</div>
  )


}

export default AddNode