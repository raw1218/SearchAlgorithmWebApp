import React, { useContext, useEffect, useRef } from 'react'
import "./ForceGraphEditor.css"

import { forceGraphRefContext } from '../ForceGraphAndEditor'
const Cluster = ({id, selectedID, setSelectedID}) => {



    const ref = useRef();
    const {forceGraphRef} = useContext(forceGraphRefContext)


    const select = ()=>{
        setSelectedID(id);
        
        forceGraphRef.current.createClusterOfClusters(10,12,4,7,250,250);


    }



    useEffect(() => {
      const curr = ref.current;
        if(!curr)return;

        curr.addEventListener('click',select);
    
      return () => {
        curr.removeEventListener('click',select)
      }
    }, [])
    

    const selected = id == selectedID;
    const className = "Cluster " + (selected? "selected" : "")
  return (
    <div ref = {ref} className={className}>Cluster Graph</div>
  )
}

export default Cluster