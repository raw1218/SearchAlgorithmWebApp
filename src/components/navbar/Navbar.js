import React, { useContext, useEffect, useState } from 'react'
import Dropdown from './DropDown';
import "./Navbar.css"
import { algorithmRefContext, visualizationTypeContext, updateContext } from '../AppWindow';
import BreadthFirstSearch from '../../classes/BreadthFirstSearch';
import DepthFirstSearch from '../../classes/DepthFirstSearch';
import Algorithm from '../../classes/Algorithm';


const Navbar = ({height}) => {


  

    const [expandedID, setExpandedID] = useState(-1);
    
    const {algorithmRef} = useContext(algorithmRefContext);
    const {visualizationType, setVisualizationType} = useContext(visualizationTypeContext)



    useEffect(()=>{
        setAlg(algorithmRef.current.type)
    }, [visualizationType])

    const {update,setUpdate} = useContext(updateContext)

    const setAlg = (type) => {

        const graph = algorithmRef.current.graph;
        const start = algorithmRef.current.start;
        const end = algorithmRef.current.end;
        var newAlg;
        if(type == "Breadth First Search"){newAlg = new BreadthFirstSearch({})}
        if(type == "Depth First Search"){newAlg = new DepthFirstSearch({})}
        if(type == "Algorithm")newAlg = new Algorithm({});
        newAlg.start = start;
        newAlg.end = end;
        
        newAlg.setGraph(graph)
        algorithmRef.current = newAlg;


        console.log("heres the new alg ref", algorithmRef)
        setUpdate(!update);
    }



 


    const algOptions = [{name: "Breadth First Search", value: "Breadth First Search" ,function: ()=>{setAlg("Breadth First Search")}},
                        {name: "Depth First Search", value: "Depth First Search", function: ()=>{setAlg("Depth First Search")}},
          
                    ]
    
    const viewOptions = [{name: "Grid", value: "Grid", function: ()=>{setVisualizationType("grid")}},
                            {name:"Node-Link Diagram", value: "Node-Link Diagram", function: ()=>{setVisualizationType('node-link diagram')}}
                        ]
  
  
    return<div className='navbar' style={{height: height,}}>
        <Dropdown id = {0} expandedID = {expandedID} setExpandedID = {setExpandedID} 
                    options = {algOptions} defaultText = "Select Algorithm"/>
        <Dropdown id = {1} expandedID = {expandedID} setExpandedID = {setExpandedID} 
                    options = {viewOptions} defaultText = "Select View Type"/>
       
    </div> 



    
  



}

export default Navbar