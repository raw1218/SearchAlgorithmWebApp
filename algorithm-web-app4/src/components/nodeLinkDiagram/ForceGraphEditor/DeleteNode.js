import React, {useRef,useEffect, useContext} from 'react'
import './ForceGraphEditor.css'
import { editorSelectionContext } from '../ForceGraphAndEditor'
const DeleteNode = ({id,selectedID,setSelectedID}) => {


  const ref = useRef()

  const {editorSelection, setEditorSelection} = useContext(editorSelectionContext)


  const select = () => {
   
    setSelectedID(id)
    setEditorSelection('delete')
 }

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
  const className = "EditGraph delete " + (selected? "selected" : "") 


  return (

    <div className = {className} ref = {ref}>Delete Node/ Link</div>
  )


}

export default DeleteNode