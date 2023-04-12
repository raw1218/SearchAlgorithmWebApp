


import React , {useState, useContext} from 'react'
import "./GridEditor.css"
import PlayButton from '../../navbar/PlayButton'
import GridSizeEditor from './GridSizeEditor'
import Maze from './Maze'


import CellType from './CellType'
const GridEditor = ({horizontal, dimensions}) => {


  const [selectedID, setSelectedID] = useState(-1)






  return (

    <div style = {{width: dimensions.width, height: dimensions.height}}className = {'GridEditor ' + (horizontal? "horizontal": "vertical")}>
 
      <CellType id = {1} type = "start" selectedID = {selectedID} setSelectedID  = {setSelectedID}/>
      <CellType id = {2} type = "end"  selectedID = {selectedID} setSelectedID = {setSelectedID}/>
      <CellType id = {3} type = "obstacle" selectedID = {selectedID} setSelectedID={setSelectedID}/>
      <CellType id = {5} type = "none" selectedID={selectedID} setSelectedID={setSelectedID}/>
      <PlayButton id = {4} selectedID={selectedID} setSelectedID={setSelectedID}/>
      <GridSizeEditor />
      <Maze/>
    </div>
  )
}
export default GridEditor