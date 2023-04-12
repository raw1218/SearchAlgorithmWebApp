import React, { useContext, useEffect, useRef } from 'react'
import MazeGeneratorDFS from '../../../classes/MazeGeneratorDFS'
import { algorithmRefContext } from '../../AppWindow'
import "./GridEditor.css"
import Graph from '../../../classes/Graph'
import Algorithm from '../../../classes/Algorithm'


const Maze = () => {

  
 
    const ref = useRef()
    const {algorithmRef} = useContext(algorithmRefContext);
    const mazeAlgorithmRef = useRef(new MazeGeneratorDFS({}));

    const  createMaze = async ()=> {

      if (mazeAlgorithmRef.current.completed == false)return;

      algorithmRef.current.graph.resetNodes()

      mazeAlgorithmRef.current = new MazeGeneratorDFS({})
      mazeAlgorithmRef.current.setGraph(algorithmRef.current.graph)


      algorithmRef.current.start = null
      algorithmRef.current.end = null
      const nodesMap = algorithmRef.current.graph.nodes
      const edges = algorithmRef.current.edges

      let nodeIDArray = []
      
      for(let key in nodesMap){
        const node = nodesMap[key]
        nodeIDArray.push(node.id)

        

        node.setNodeType("obstacle")
        
        
      }



      const randomIndex = Math.floor(Math.random() * nodeIDArray.length);
      const randomNodeID = nodeIDArray[randomIndex];
      await mazeAlgorithmRef.current.startSearch(1500/nodeIDArray.length, randomNodeID)
      
      console.log("new grahp edges = ", mazeAlgorithmRef.current.newEdges)

  /*  const graph = new Graph({nodes: algorithmRef.current.nodes,  edges: mazeAlgorithmRef.current.newEdges})
      const newAlg = new Algorithm({graph: graph});
      algorithmRef.current = newAlg;  */


      algorithmRef.current.graph.edges = mazeAlgorithmRef.current.newEdges



      console.log("algorithm ref = " ,algorithmRef)






    }




    function handleClick(e){
      createMaze();
    }


    useEffect(() => {
      const button = ref.current
      if(!button)return;

      button.addEventListener('click',handleClick)
    
      return () => {
        button.removeEventListener('click',handleClick)
      }
    }, [])
    

 
 
    return (
    <div className='Maze' ref  = {ref}>Create Maze</div>
  )
}

export default Maze