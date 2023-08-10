import React, { useEffect, useState, useRef } from 'react';
import Navbar from './navbar/Navbar';
import GraphAndEditor from './GraphAndEditor';
import './AppWindow.css';
import Algorithm from '../classes/Algorithm'
import Graph from '../classes/Algorithm'
import GridAndEditor from './gridAndEditor/GridAndEditor';





export const algorithmRefContext = React.createContext();
export const visualizationTypeContext = React.createContext();
export const updateContext = React.createContext();

const AppWindow = () => {
    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
    const appWindowRef = useRef(null);

    const [visualizationType, setVisualizationType] = useState("node-link diagram");
    const algorithmRef = useRef(new Algorithm({graph: new Graph({})}))

    const [update,setUpdate] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        const rect = appWindowRef.current.getBoundingClientRect();
        setWindowDimensions({
          width: rect.width,
          height: rect.height,
        });
      };
  
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    const navbarHeight = Math.min(Math.max(windowDimensions.height / 8, 50), 150);
  
    return (

      <updateContext.Provider value ={{update:update, setUpdate:setUpdate}}>
        <visualizationTypeContext.Provider value = {{visualizationType: visualizationType, setVisualizationType: setVisualizationType}}>
        <algorithmRefContext.Provider value = {{algorithmRef: algorithmRef}}>
      
      <div ref={appWindowRef} className="app-window">
        <Navbar height={navbarHeight} />
        <GraphAndEditor type = {visualizationType} dimensions={{ width: windowDimensions.width, height: windowDimensions.height - navbarHeight }} />
      </div>

      
      </algorithmRefContext.Provider>
        </visualizationTypeContext.Provider>
        </updateContext.Provider>
    );
  };
  
  export default AppWindow;
