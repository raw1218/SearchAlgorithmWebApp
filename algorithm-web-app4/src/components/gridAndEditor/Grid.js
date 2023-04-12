import React, { useRef, useState, useEffect, useContext } from 'react';
import GridCell from './GridCell2';
import './Grid.css';
import { editorSelectionContext } from './GridAndEditor';
import { algorithmRefContext, updateContext } from '../AppWindow';
import Graph from '../../classes/Graph';


const Grid = ({ rotated, x, y, dimensions }) => {

  const {update,setUpdate} = useContext(updateContext)
 
  const gridRef = useRef(null);
  const hoveredCellIDRef = useRef({x:-1, y:-1})
  const cellRefsRef = useRef(new Map())
  const startCellIDRef = useRef({x:-1,y:-1});
  const endCellIDRef = useRef({x:-1,y:-1});
  const isDraggingRef = useRef(false)

  const graphSetRef = useRef(false);

  const {algorithmRef} = useContext(algorithmRefContext);
  const graphRef = useRef(new Graph({}))
  const {editorSelection,setEditorSelection} = useContext(editorSelectionContext)



  const renderGridCells = () => {
    const newGraph = new Graph({})
    const gridCells = [];
    if (rotated) {
      for (let colIndex = 1; colIndex <= x; colIndex++) {
        for (let rowIndex = y ; rowIndex > 0; rowIndex--) {
          const index = {x:colIndex, y:rowIndex}
          const key = JSON.stringify(index);
          let newRef = React.createRef();
          if(cellRefsRef.current[key])newRef = cellRefsRef.current[key];
          gridCells.push(<GridCell ref = {newRef}key={key} id = {index} rotated = {rotated}/> )
          cellRefsRef.current[key] = newRef
          newGraph.addNode(index,newRef)
        }
      }
    } else {
      for (let rowIndex = 1; rowIndex <= y; rowIndex++) {
        for (let colIndex = 1; colIndex <= x; colIndex++) {
          const index = {x:colIndex, y:rowIndex}
          const key = JSON.stringify(index);
          let newRef = React.createRef();
          if(cellRefsRef.current[key])newRef = cellRefsRef.current[key];
          gridCells.push(<GridCell ref = {newRef}key={key} id = {index} rotated = {rotated} />);
          cellRefsRef.current[key] = newRef;      
          newGraph.addNode(index,newRef)
        }
    
      }
    }

    if(!graphSetRef.current){
    newGraph.setGridEdges(x,y)
    algorithmRef.current.graph = newGraph;
    graphRef.current = newGraph;graphSetRef.current = true;}
    return gridCells;
  };


  const findClosestCell = (mouseX, mouseY) => {
    const rect = gridRef.current.getBoundingClientRect();
      const cellWidth = rect.width / (rotated ? y : x);
      const cellHeight = rect.height / (rotated ? x : y);
      const columnIndex = Math.floor((mouseX - rect.left) / cellWidth);
      const rowIndex = Math.floor((mouseY - rect.top) / cellHeight);
      if (rotated) {
        console.log("finding closest cell rotated. The rowIndex = ", rowIndex, "and the collumn index is ", columnIndex)
        return({ x: rowIndex + 1  , y: y - columnIndex});
      } else {
        return({ x: columnIndex +1 , y: rowIndex +1 });
      }
  }


  const setHoveredCell = (index) => {

      
    
    let oldKey = JSON.stringify(hoveredCellIDRef.current);
    let newKey = JSON.stringify(index);

    let oldRef = cellRefsRef.current[oldKey];
    let newRef = cellRefsRef.current[newKey];

    hoveredCellIDRef.current = index;
    if(oldKey == newKey)return;
    


    
    if(oldRef)oldRef.current.setHovered(false);

    if(newRef)newRef.current.setHovered(true);

    

    
  }

  useEffect(()=>{
   
  })

  const triggerCell = (index, type) => {






    if(type == "default")return;
    if(index.x == startCellIDRef.current.x && index.y == startCellIDRef.current.y){startCellIDRef.current = {x:-1, y: -1};algorithmRef.current.start = null;setUpdate(!update)}
    if(index.x == endCellIDRef.current.x && index.y == endCellIDRef.current.y){endCellIDRef.current = {x:-1, y: -1};algorithmRef.current.end=null;setUpdate(!update)}


    console.log("triggering cell id =", index, "type = ", type)

    const cellRef = cellRefsRef.current[JSON.stringify(index)];
    if(!cellRef) {console.log('returning from trigger');return;}

    var resetRef;
    var resetIndex;

    if (type == 'start'){

      console.log("start", resetIndex);
      resetIndex = startCellIDRef.current;
      resetRef = cellRefsRef.current[JSON.stringify(startCellIDRef.current)];
      startCellIDRef.current = index;
      algorithmRef.current.start = startCellIDRef.current;
      setUpdate(!update)
    }

    if (type == 'end'){
      resetIndex = endCellIDRef.current;
      resetRef = cellRefsRef.current[JSON.stringify(endCellIDRef.current)];
      endCellIDRef.current = index;
      algorithmRef.current.end = endCellIDRef.current;
      setUpdate(!update)
    }


    if (type == 'obstacle'){
      console.log("setting obstacle for object", algorithmRef.current.graph.getNode(index))
      algorithmRef.current.graph.getNode(index).setNodeType('obstacle');
      
    }

    

    if(resetRef){

      triggerCell(resetIndex, "none");
      
    }

    console.log("algorithmRef.current.graph.getNode(index)  = ", algorithmRef.current.graph.getNode(index))
    
  
    cellRefsRef.current[JSON.stringify(index)].current.setType(type);
    //algorithmRef.current.graph.getNode(index).current.setType(type);

  }



  
  const handleMouseDown = (e) =>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    isDraggingRef.current = true;
    if(editorSelection == "start" || editorSelection == "end")isDraggingRef.current = false;
  }




  const handleMouseUp = (event) => {
    event.preventDefault();
    triggerCell(findClosestCell(event.clientX, event.clientY), editorSelection);

    isDraggingRef.current = false;
  }

  const handleMouseLeave = (event) => {
    setHoveredCell({x:-1, y:-1})
  }

  const handleMouseMove = (e) => {

    const closestCell = findClosestCell(e.clientX,e.clientY);
    setHoveredCell(closestCell);

    if(isDraggingRef.current){
      triggerCell(closestCell,editorSelection)
    }
  };


  const handleTouchMove = (e) =>{
    e.preventDefault();
    const mouseX = e.touches[0].clientX;
    const mouseY = e.touches[0].clientY;
    const closestCell = findClosestCell(mouseX, mouseY);
    setHoveredCell(closestCell)

    if(isDraggingRef.current){
      triggerCell(closestCell,editorSelection);
    }
  }

  const handleTouchStart = (e) => {

    const mouseX = e.touches[0].clientX;
    const mouseY = e.touches[0].clientY;
    const closestCell = findClosestCell(mouseX,mouseY);
    setHoveredCell(closestCell);
    isDraggingRef.current = true;
    if(editorSelection == "start" || editorSelection == "end")isDraggingRef.current = false;
  }

  const handleTouchEnd = (e) => {
    const mouseX = e.changedTouches[0].clientX;
    const mouseY = e.changedTouches[0].clientY;
    const closestCell = findClosestCell(mouseX,mouseY);
    isDraggingRef.current = false;

    triggerCell(closestCell);
    setHoveredCell({x:-1,y:-1})
  }

  useEffect(() => {


    const grid = gridRef.current;
    if(!grid)return;

    
    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseleave',handleMouseLeave);
    grid.addEventListener('mouseup',handleMouseUp);
    grid.addEventListener('mousedown',handleMouseDown);
    grid.addEventListener('touchstart',handleTouchStart);
    grid.addEventListener('touchend',handleTouchEnd);
    grid.addEventListener('touchmove',handleTouchMove);
    
    return () => {
      
    grid.removeEventListener('mousemove', handleMouseMove);
    grid.removeEventListener('mouseleave',handleMouseLeave);
    grid.removeEventListener('mouseup',handleMouseUp);
    grid.removeEventListener('mousedown',handleMouseDown);
    grid.removeEventListener('touchstart',handleTouchStart);
    grid.removeEventListener('touchend',handleTouchEnd);
    grid.removeEventListener('touchmove',handleTouchMove);
    }}, [x, y, rotated, editorSelection, algorithmRef.current]);






    useEffect(()=>{

     
      graphSetRef.current = false;

      
    }, [x,y])




  return (
    <div
      ref={gridRef}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${rotated ? y : x}, 1fr)`,
        gridTemplateRows: `repeat(${rotated ? x : y}, 1fr)`,
       
      }}
    >
      {renderGridCells()}
    </div>
  );
};

export default Grid;



