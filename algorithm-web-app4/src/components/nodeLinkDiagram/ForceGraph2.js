
import * as d3 from "d3";
import { forceCenter, forceCollide, map, svg } from "d3";
import React, { useEffect, useMemo, useState, useContext , useCallback, useLayoutEffect, useRef, forwardRef, useImperativeHandle} from "react";
import ForceGraphLink from "./ForceGraphLink";
import ForceGraphNode from "./ForceGraphNode"
import Graph from "../../classes/Graph";



import './ForceGraph.css'
import { editorSelectionContext } from "./ForceGraphAndEditor";
import { algorithmRefContext } from "../AppWindow";
import ForceGraphNewLine from "./ForceGraphNewLine";
import Algorithm from "../../classes/Algorithm";

import { updateContext } from "../AppWindow";

const  ForceGraph = forwardRef(({width,height}, ref) => {



  

  const {update,setUpdate} = useContext(updateContext)

  const zoomScaleLevelRef = useRef(0)

  const [animatedNodes, setAnimatedNodes] = useState([]);
  const [animatedLinks, setAnimatedLinks] = useState([]);
  const [nodes, setNodes] =  useState(d3.range(30).map(n => {
    return {id: n, r: 15,x : width/2 + n, y: height/2 - n}
}))
  const [links,setLinks] = useState([{source: 1, target:2}])

  

  const [charge, setCharge] = useState(-30)


  const [zoomScale, setZoomScale] = useState(1);
  const zoomScaleTargetRef = useRef(1)
  const zoomScaleAlpha  = 0.1
  const minimumZoomScale = 0.1


  //states for drawing a new link

  const [newLinkStartX, setNewLinkStartX] = useState()
  const [newLinkStartY, setNewLinkStartY] = useState()
  const [newLinkEndX, setNewLinkEndX] = useState()
  const [newLinkEndY, setNewLinkEndY] = useState()
  const isDrawingNewLinkRef = useRef(false)
  const newLinkSourceIDRef = useRef(null)
  const newLinkTargetIDRef = useRef(null)

  
  const svgRef = useRef()
  const svgContentRef = useRef()
  const svgCoordinateRef = useRef();

  const nodeRefsRef = useRef(new Map())
  const linkRefsRef = useRef(new Map())
  const {algorithmRef} = useContext(algorithmRefContext) 
  const startIDRef = useRef(-1);
  const endIDRef = useRef(-1);

  
  
  const {editorSelection, setEditorSelection} = useContext(editorSelectionContext)

  const simulationRef = useRef()

  


  //update algorithm graph every time nodes or links change
  useEffect(() => {
   
    algorithmRef.current.graph = new Graph({})
    


    for(let n of nodes){
    let ref = nodeRefsRef.current[n.id]
    if(!ref)ref = React.createRef()
    nodeRefsRef.current[n.id] = ref

    algorithmRef.current.graph.addNode(n.id, ref);}


    for(let l of links){
      let ref = linkRefsRef.current[JSON.stringify(l)]
      if(!ref)ref = React.createRef()
      
      linkRefsRef.current[JSON.stringify({source:l.source.id, target:l.target.id})] = ref;
      linkRefsRef.current[JSON.stringify(l)] = ref;
      algorithmRef.current.graph.addEdge(l.source,l.target,ref)
      algorithmRef.current.graph.addEdge(l.target,l.source,ref)
    }

    console.log("algorithemRef = ", algorithmRef)
    console.log("links ref ref = ", linkRefsRef)
    
  
    
  }, [nodes,links])
  

  // re-create animation every time nodes or links change
  useEffect(() => {

    const svg = d3.select(svgContentRef.current)
    const linkData = [...links.map(l => ({target: l.target, source: l.source}))]


    simulationRef.current = d3
      .forceSimulation([...nodes])
      .force("link", d3.forceLink(linkData).id(d => d.id).distance(200))
      .force("x", d3.forceX(width/2).strength(0.002 * (height > width? height/width  : 1 ) ))
      .force("y", d3.forceY(height/2).strength(0.002 * (height > width? 1 : width/height )))
      .force("charge", d3.forceManyBody().strength(charge))
      .force("collision", forceCollide().radius(d =>   d.r / zoomScale));
      
   
   
    

    simulationRef.current.on("tick",  () => {
     
      
      
      setAnimatedNodes([...simulationRef.current.nodes()])
     
      
      setAnimatedLinks([...linkData])

     

    }); 
  
  
    simulationRef.current.alpha(1).alphaDecay(0.01).restart();

   
    return () => simulationRef.current.stop();
  }, [links,nodes, charge, width, height]);




  //Automatically Zoom 

     useEffect( () => {

      if([...animatedNodes].length == 0){return }
      

     const first = animatedNodes[0]

     

      var leftMax = first.x
      var rightMax = first.x
      var upMax = first.y 
      var downMax = first.y

      for(const node of [...animatedNodes]){

        if(node.x < leftMax)leftMax = node.x
        if(node.x > rightMax)rightMax = node.x
        if(node.y < downMax)downMax = node.y
        if(node.y > upMax)upMax = node.y
        
      }


      const centerX = (leftMax + rightMax)/2
      const centerY = (upMax + downMax) /2

      const xZoom =  (width - 75) /  (Math.abs(leftMax - rightMax) )
      const yZoom =  (height - 75) / (Math.abs(upMax - downMax))

      var maxZoom = Math.min(xZoom, yZoom) 
      maxZoom = Math.max(maxZoom, minimumZoomScale)


      
      svgCoordinateRef.current = svgContentRef.current.getScreenCTM().inverse()

      zoomScaleTargetRef.current = maxZoom;


     
    
    } , [animatedNodes, width, height])


    useEffect(() => {

      const diff = zoomScaleTargetRef.current - zoomScale;
      const newZoomScale = zoomScale + (diff * zoomScaleAlpha);

      setZoomScale(newZoomScale)
      
    }, [zoomScaleTargetRef.current])

  
    
    //update start and end nodes in alg

    useEffect(()=>{
      algorithmRef.start = startIDRef.current;
      algorithmRef.end = endIDRef.current;
    }, [startIDRef.current, endIDRef.current])



//Functions to modify graph
    const  addNode = (x,y) => {
        
        const newID = animatedNodes.reduce((max, node) => Math.max(max, node.id), 0) + 1
        const newNode = {id: newID, x: x, y: y, vx : 0 , vy: 0, r : 15, collisionRadius: 15/zoomScale}

        
        const newNodes = [...animatedNodes, newNode] 
        setNodes(newNodes)
        
        return (newNode);
        
    }

    const deleteNode = (id) => {

      nodeRefsRef.current.delete(id);

      
      const filteredNodes = animatedNodes.filter(n => n.id !== id)
      const updatedNodes = filteredNodes.map(n => ({...n, vx: 0, vy: 0 }))
      setNodes(updatedNodes)

      const filteredLinks = [...links.filter(l => (l.target != id && l.source != id))]
      setLinks(filteredLinks)
    }

    const addLink = (fromID, toID) => {



      const newLink = {source: fromID, target: toID}
      const newLinks = [...links, newLink]
      setLinks(newLinks)
    }

    const deleteLink = (fromID, toID) => {

      console.log("deleting link from ", fromID, "to", toID)
      
      const filteredLinks = [...links.filter(l => (l.source != fromID || l.target != toID))]
      setLinks(filteredLinks)
    }

    //helper function to transform screen coordinates to svg coordinates

    const getSVGCoordinates = (screenCoordinateX, screenCoordinateY) => {

      const domPoint = new DOMPoint(screenCoordinateX,screenCoordinateY)
      const relativePoint = domPoint.matrixTransform(svgCoordinateRef.current)

      return [relativePoint.x,relativePoint.y]

    }

    const isInsideSVG = (x,y) => {
      
      const rect = svgRef.current.getBoundingClientRect()

      if(x < rect.left || x > rect.right)return false
      if(y < rect.top || y > rect.bottom){return false}

      
      return true;
    }

    //helper function to start Drawing the new line 

    const startDrawingNewLine = (x,y) => {


      const [svgX, svgY] = getSVGCoordinates(x,y)
      if(editorSelection == 'addLink'){

        setNewLinkEndX(null)
        setNewLinkEndY(null)
        isDrawingNewLinkRef.current = true;

        if(newLinkSourceIDRef.current == null){
        
        setNewLinkStartX(svgX)
        setNewLinkStartY(svgY)}
      }
    }

    const updateNewLine = (x,y) => {

      
      const [svgX, svgY] = getSVGCoordinates(x,y)

      if (!isInsideSVG(x,y)){
        cancelNewLine();
      }

      if(isDrawingNewLinkRef.current){
        if(newLinkTargetIDRef.current == null){
        setNewLinkEndX(svgX)
        setNewLinkEndY(svgY)}
      }
    }

    const finishNewLine = (x,y) => {

      const [svgX, svgY] = getSVGCoordinates(x,y)

      isDrawingNewLinkRef.current = false;
      if(newLinkSourceIDRef.current != null && newLinkTargetIDRef.current != null){

        addLink(newLinkSourceIDRef.current, newLinkTargetIDRef.current);

      }

      if(newLinkSourceIDRef.current == null && newLinkTargetIDRef.current != null){
        const newNode = addNode(svgX,svgY)
        addLink(newNode.id, newLinkTargetIDRef.current)
      }


      if(newLinkSourceIDRef.current != null && newLinkTargetIDRef.current == null){
        const newNode = addNode(svgX,svgY)
        addLink(newLinkSourceIDRef.current, newNode.id)
      }


      cancelNewLine();




      
    }

    const cancelNewLine = () => {
      newLinkSourceIDRef.current = null;
      newLinkTargetIDRef.current = null;
      setNewLinkEndX(null)
      setNewLinkStartX(null)
      setNewLinkStartY(null)
      setNewLinkEndY(null)
    }

 
    //event listeners 

    function handleClick(e){
      const x = e.clientX
      const y = e.clientY
      const [svgX, svgY] = getSVGCoordinates(x,y)   
      if(editorSelection == 'addNode')addNode(svgX, svgY); 
    }

    function handleMouseLeave(e) {
      cancelNewLine();
    }

    function handleMouseDown(e) {
      const x = e.clientX
      const y = e.clientY
      startDrawingNewLine(x,y)
    }

    function handleTouchStart(e) {
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      startDrawingNewLine(x,y)
    }

    function handleMouseMove(e) {
      e.preventDefault()
      const x = e.clientX
      const y = e.clientY
      updateNewLine(x,y)
    }

    function handleTouchMove(e) {
      e.preventDefault();
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      updateNewLine(x,y)
    }

    function handleMouseUp(e){
      const x = e.clientX
      const y = e.clientY
      finishNewLine(x,y)
    }

    function handleTouchEnd(e){
     
      const x = e.changedTouches[0].clientX
      const y = e.changedTouches[0].clientY
      finishNewLine(x,y)
      const [svgX, svgY] = getSVGCoordinates(x,y)   
      if(editorSelection == 'addNode')addNode(svgX, svgY);       

    }

    useEffect(() => {
    
      const svg = svgRef.current
      if(!svg)return

      svg.addEventListener('click', handleClick)
      svg.addEventListener('mouseleave', handleMouseLeave)
     svg.addEventListener('mousedown', handleMouseDown)
      svg.addEventListener('mousemove', handleMouseMove)
      svg.addEventListener('mouseup', handleMouseUp)
      svg.addEventListener('touchstart', handleTouchStart)
      svg.addEventListener('touchmove',handleTouchMove)
      svg.addEventListener('touchend', handleTouchEnd)
      return () => {

        svg.removeEventListener('click', handleClick)
        svg.removeEventListener('mouseleave', handleMouseLeave)
        svg.removeEventListener('mousedown', handleMouseDown)
        svg.removeEventListener('mousemove', handleMouseMove)
        svg.removeEventListener('mouseup', handleMouseUp)
        svg.removeEventListener('touchstart', handleTouchStart)
        svg.removeEventListener('touchmove',handleTouchMove)
        svg.removeEventListener('touchend', handleTouchEnd)
        
      }
    }, [addNode, handleMouseMove, newLinkSourceIDRef.current, newLinkTargetIDRef.current ,handleClick, startDrawingNewLine, updateNewLine, finishNewLine, handleMouseMove])


  

    const createClusterOfNodes = (startID, numNodes, centerX, centerY) => {
      // Create the central node
      const centralNode = { id: startID, r: 15, x: centerX, y: centerY };
    
      // Create new surrounding nodes
      const newNodes = d3.range(numNodes).map((n) => {
        const angle = 2 * Math.PI * (n / numNodes);
        const x = centerX + 100 * Math.cos(angle);
        const y = centerY + 100 * Math.sin(angle);
        return { id: startID + n + 1, r: 15, x: x, y: y };
      });
    
      newNodes.unshift(centralNode);
    
      // Create new links between the central node and surrounding nodes
      const newLinks = d3.range(numNodes).map((n) => {
        return { source: startID, target: n + 1 + startID };
      });
    
      return { nodes: newNodes, links: newLinks };
    };
    
    const createClusterOfClusters = (minNumClusters, maxNumClusters, minNumNodesPerCluster, maxNumNodesPerCluster, centerX, centerY) => {
      // Clear the nodes and links
      setNodes([]);
      setLinks([]);
    
      let newNodes = [];
      let newLinks = [];
    
      // Create the main central node
      const mainCentralNode = { id: 0, r: 15, x: centerX, y: centerY };
      newNodes.push(mainCentralNode);
    
      const numClusters = Math.floor(Math.random() * (maxNumClusters - minNumClusters + 1)) + minNumClusters;
      // Create new clusters around the main central node
      for (let i = 0; i < numClusters; i++) {
        const angle = 2 * Math.PI * (i / numClusters);
        const intermediateX = centerX + 150 * Math.cos(angle);
        const intermediateY = centerY + 150 * Math.sin(angle);
    
        const intermediateNode = { id: 1 + i * 13, r: 15, x: intermediateX, y: intermediateY };
        newNodes.push(intermediateNode);
        newLinks.push({ source: mainCentralNode.id, target: intermediateNode.id });
    
        const secondIntermediateX = centerX + 300 * Math.cos(angle);
        const secondIntermediateY = centerY + 300 * Math.sin(angle);
    
        const secondIntermediateNode = { id: 2 + i * 13, r: 15, x: secondIntermediateX, y: secondIntermediateY };
        newNodes.push(secondIntermediateNode);
        newLinks.push({ source: intermediateNode.id, target: secondIntermediateNode.id });
    
        const clusterCenterX = centerX + 450 * Math.cos(angle);
        const clusterCenterY = centerY + 450 * Math.sin(angle);
    
        const numNodes = Math.floor(Math.random() * (maxNumNodesPerCluster - minNumNodesPerCluster + 1)) + minNumNodesPerCluster;
        const startID = 3 + i * 13;
        const clusterData = createClusterOfNodes(startID, numNodes, clusterCenterX, clusterCenterY);
    
        newNodes = newNodes.concat(clusterData.nodes);
        newLinks = newLinks.concat(clusterData.links);
    
        // Connect the second intermediate node to the central node of each cluster
        newLinks.push({ source: secondIntermediateNode.id, target: startID });
      }
    
      // Update the nodes and links state

      for(const node of newNodes){
        node.id = node.id + 1;

      }

      for(const link of newLinks){
        link.source += 1;
        link.target +=1;
      }
      setNodes(newNodes);
      setLinks(newLinks);
    };


    useImperativeHandle(
      ref,
      () => {
        return {createClusterOfClusters: createClusterOfClusters}
      },
      [],
    )



    


    return (
        

        
        <svg  className = 'ForceGraphSVG'width = {width} height = {height} ref = {svgRef}  >
        <g className = "ForceGraphSVGContent"  ref = {svgContentRef}style = {{ transform: `scale(${zoomScale})` }}>
       
        <g>

         {animatedLinks.map((link, index) => (

          
            <ForceGraphLink
              ref = {linkRefsRef.current[JSON.stringify({source: link.source.id, target: link.target.id})]}
              source = {link.source}
              x1 = {link.source.x}
              x2 = {link.target.x}
              y1 = {link.source.y}
              y2 = {link.target.y} 
              key = {link.source.id + " " + link.target.id}
              helper = {link.source.id + " " + link.target.id}
              deleteLink = {() => {deleteLink(link.source.id, link.target.id)}}
              
              />)
         )}
              </g>


              <g className = "ForceGraphNodes">
          {animatedNodes.map((node) => (
            <ForceGraphNode
            ref = {nodeRefsRef.current[node.id]}
            key = {node.id}
              x = {node.x}
              y = {node.y}
              r = {node.r}
              collisionRadius = {node.collisionRadius}
              id = {node.id}
              deleteNode = {() => deleteNode(node.id)}
              scale = {zoomScale}
              snapNewLineStartToNode = {() => {newLinkSourceIDRef.current = node.id; setNewLinkStartX(node.x); setNewLinkStartY(node.y);}}
              snapNewLineEndToNode = {() => {newLinkTargetIDRef.current = node.id; setNewLinkEndX(node.x); setNewLinkEndY(node.y)}}
              isDrawingNewLinkRef = {isDrawingNewLinkRef}
              newLinkSourceIDRef = {newLinkSourceIDRef}
              newLinkTargetIDRef = {newLinkTargetIDRef}
              startIDRef = {startIDRef}
              endIDRef = {endIDRef}
             
              />
            ))}
         
        </g>
              
              <g className = "ForceGraphNewLineG">
                <ForceGraphNewLine 
                  x1 = {newLinkStartX}
                  x2 = {newLinkEndX}
                  y1 = {newLinkStartY}
                  y2 = {newLinkEndY}
                  

        
                  />
                </g>
              </g>
              </svg>
              
       
      );


    
    })






export default ForceGraph