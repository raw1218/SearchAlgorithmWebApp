
import React, {useContext, useMemo, useState, useRef} from 'react'
import * as d3 from 'd3'
import ForceGraph from './ForceGraph2';
import ForceGraphEditor from './ForceGraphEditor/ForceGraphEditor';

export const editorSelectionContext = React.createContext()
export const forceGraphRefContext = React.createContext();

export default function Parent({width,height}) {
    
    const [editorSelection, setEditorSelection] = useState("default")
    const forceGraphRef = useRef();
    const forceGraphWidth = width * (2/3)
    const editorWidth = width * (1/3)


    const style = {

      
      gridTemplateColumns: `${forceGraphWidth}px  1fr`,
    
     

    }
    
    return (

      <editorSelectionContext.Provider value = {{editorSelection: editorSelection, setEditorSelection: setEditorSelection}}>
     <forceGraphRefContext.Provider value = {{forceGraphRef:forceGraphRef}}>
     
      <div className="GraphAndEditor" style={style}>
        
          <ForceGraph ref = {forceGraphRef} width = {forceGraphWidth} height = {height} />
          <ForceGraphEditor width = {editorWidth} height = {height}/>
   
      </div>
</forceGraphRefContext.Provider>
      </editorSelectionContext.Provider>
    );
  }
  