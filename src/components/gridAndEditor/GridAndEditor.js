
import React, { useRef, useState, useEffect } from 'react';
import Grid from './Grid';
import GridEditor from './gridEditor/GridEditor';
import './Grid.css';


export const editorSelectionContext = React.createContext()
export const gridSizeContext = React.createContext({gridX : 50, gridY: 50, setGridX: ()=>{}, setGridY: ()=>{}});


const GridAndEditor = ({ dimensions }) => {
    const [x, setX] = useState(10);
    const [y, setY] = useState(20);
    const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
    const [editorDimensions, setEditorDimensions] = useState({ width: 0, height: 0 });
    const [rotated, setRotated] = useState(true);
    const [top,setTop] = useState(true);
    

    const [editorSelection, setEditorSelection] = useState("default");
   
    useEffect(() => {

        const minHorizontalEditorHeight = 16 * 9
        const minVerticalEditorWidth = 16 * 9

        const {width,height} = dimensions
        console.log("I want this to get called")
          // Determine if the grid is rotated
          let gridRotated;
          if(width >= height){
           if(x >= y)gridRotated = false;
           else gridRotated = true;
          }
          else {
           if(x>=y)gridRotated = true;
           else gridRotated = false;
          }
           

          
        
          let gridWidthTemp = x;
          let gridHeightTemp = y;
        
          // If the grid is rotated, swap its width and height
          if (gridRotated) {
            gridWidthTemp = y;
            gridHeightTemp = x;
          }
        
          // Determine the maximum enlargement ratio for the grid
          const verticalRatio = height / gridHeightTemp;
          const horizontalRatio = width / gridWidthTemp;
          const maxEnlargement = horizontalRatio < verticalRatio ? horizontalRatio : verticalRatio;
        
          // Determine the orientation of the editor
          const editorHorizontal = horizontalRatio < verticalRatio;
        
          // Enlarge the grid to the maximum size possible while still fitting on the screen
          gridWidthTemp *= maxEnlargement;
          gridHeightTemp *= maxEnlargement;
        
          // Calculate the size of the editor based on the orientation
          let editorWidthTemp = editorHorizontal ? width : width - gridWidthTemp;
          let editorHeightTemp = editorHorizontal ? height - gridHeightTemp : height;
        
          // Adjust the grid and editor sizes if needed to meet minimum size requirements
          if (editorHorizontal && editorHeightTemp < minHorizontalEditorHeight) {
            const diff = minHorizontalEditorHeight - editorHeightTemp;
            editorHeightTemp += diff;
            gridHeightTemp -= diff;
          } else if (!editorHorizontal && editorWidthTemp < minVerticalEditorWidth) {
            const diff = minVerticalEditorWidth - editorWidthTemp;
            editorWidthTemp += diff;
            gridWidthTemp -= diff;
          }
        
          // Set the new grid and editor sizes
          setGridDimensions({height: gridHeightTemp, width: gridWidthTemp});
          setEditorDimensions({width: editorWidthTemp, height:editorHeightTemp})
          
          setRotated(gridRotated);
          setTop(editorHorizontal);
        }, [x, y, dimensions]);


    let displayRows;
    let displayCols;


    if(top){

       displayRows = `1fr ${gridDimensions.height}px`
       //displayRows = "1fr 1fr";
       displayCols = "1fr";
    }

    else{
      displayRows = "1fr";
      displayCols  = `1fr ${gridDimensions.width}px`
     //displayCols = "1fr 1fr"
    }

    



    const style = {

      display: "grid",
      gridTemplateColumns: displayCols,
      gridTemplateRows:displayRows
    }

    console.log("styles = ", style)

    
  
    return (

<gridSizeContext.Provider value = {{gridX:x, gridY:y}}>
      <editorSelectionContext.Provider value = {{editorSelection: editorSelection, setEditorSelection: setEditorSelection}}>
      <gridSizeContext.Provider value = {{gridX : x, gridY: y, setGridX : setX, setGridY: setY}}>
        

      <div className="grid-and-editor" style={ style}>
        <GridEditor dimensions={editorDimensions} horizontal={top} />
        <Grid x={x} y={y} dimensions={gridDimensions} rotated={rotated} />
      </div>


</gridSizeContext.Provider>
</editorSelectionContext.Provider>
</gridSizeContext.Provider>
    );
  };
  
  export default GridAndEditor;