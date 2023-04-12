

import React, {useContext, useEffect, useRef, useState} from 'react'
import './GridSizeEditor.css'
import GridSizeDimension from './GridSizeDimension';
import { gridSizeContext } from '../GridAndEditor';

const GridSizeEditor = () =>{

  


    const {gridX,gridY,setGridX,setGridY} = useContext(gridSizeContext);
    
    const xDimensionInitRef = useRef(gridX);
    const yDimensionInitRef = useRef(gridY);

    const [xDimension, setXDimension] = useState(gridX);
    const [yDimension, setYDimension] = useState(gridY);
    const [submitVisible, setSubmitVisible] = useState(false);
    const [submitTop, setSubmitTop] = useState(false);
    const alreadyClickedRef = useRef(false);

    






    useEffect(() => {
      if((xDimensionInitRef.current == xDimension) && (yDimensionInitRef.current == yDimension)){

        console.log("they the same")
        setSubmitVisible(false);
        alreadyClickedRef.current = false;
      }
      else{setSubmitVisible(true);}
    }, [xDimension, yDimension]);


    function submit(){

      xDimensionInitRef.current = xDimension;
      yDimensionInitRef.current = yDimension;

      setSubmitVisible(false);
      setGridX(xDimension);
      setGridY(yDimension);


    }


    const determineLayout = (top) => {

      console.log("in determine layout top = ", top)

      console.log("alreadyClickedReef = ", alreadyClickedRef)

      if(alreadyClickedRef.current == false){

        console.log("about to set submit top");
        setSubmitTop(top);
        console.log("i did it i set it to", top);
      }

      alreadyClickedRef.current = true;

    }

    var className = (submitVisible ? "gridSizeEditor submit " : "gridSizeEditor submit ") ;

 
    

    

    console.log("about to return and the className = ", className)
    return(

      
      <div className = {className}>
      
        
        <div className = "dimensions">
        <GridSizeDimension val = {xDimension} 
        setVal = {(v) => {setXDimension(v); }} setSubmitTop = {(v) => {determineLayout(v)}}></GridSizeDimension>
        <GridSizeDimension val = {yDimension} 
        setVal = {(v) => {setYDimension(v); }} setSubmitTop = {(v) =>{determineLayout(v)}}></GridSizeDimension>
        </div>
        

       

        {(submitVisible)? <div className = "submitButton" onClick={submit}> Submit</div> : <div className='submitButton No'>Set Grid Size </div>}
        </div>
      );
    };

    export default GridSizeEditor;
        


