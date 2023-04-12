import React, { useContext, useState } from 'react'
import './ForceGraphEditor.css'
import AddNode from './AddNode'
import AddLink from './AddLink'
import DeleteNode from './DeleteNode'

import { editorSelectionContext } from '../ForceGraphAndEditor'
import NodeType from './NodeType'
import PlayButton from '../../navbar/PlayButton'
import Cluster from './Cluster'

const ForceGraphEditor = () => {


  const [selectedID, setSelectedID] = useState(-1)

  const {editorSelection,setEditorSelection} = useContext(editorSelectionContext)




  return (

    <div className = 'ForceGraphEditor'>
       
       <NodeType id = {0} type = "start" setSelectedID  = {setSelectedID} selectedID = {selectedID}></NodeType>
      <NodeType id = {1} type = "end" setSelectedID = {setSelectedID} selectedID = {selectedID}></NodeType>
   
      <PlayButton id  = {6} setSelectedID={setSelectedID} selectedID={selectedID}/>
         <AddNode  id = {2} setSelectedID = {setSelectedID} selectedID = {selectedID}/>
      <AddLink id = {3} setSelectedID = {setSelectedID} selectedID = {selectedID}/>
      <DeleteNode id = {4} setSelectedID = {setSelectedID} selectedID = {selectedID}/> 
    <Cluster id = {5} setSelectedID={setSelectedID} selectedID={selectedID}/>
    
    </div>
  )
}

export default ForceGraphEditor