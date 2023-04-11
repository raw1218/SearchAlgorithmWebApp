import React, { useRef } from 'react'

import GridAndEditor from './gridAndEditor/GridAndEditor'
import Parent from './nodeLinkDiagram/ForceGraphAndEditor'
import "./AppWindow.css"

const GraphAndEditor = ({dimensions, type}) => {




    if(type == "grid")return <GridAndEditor dimensions = {dimensions}/>

    if(type == "node-link diagram")return <Parent width = {dimensions.width} height = {dimensions.height}/>


}

export default GraphAndEditor