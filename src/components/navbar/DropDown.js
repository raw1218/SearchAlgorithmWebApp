// Dropdown.js
import React, { useState , useEffect, useRef} from 'react';
import './DropDown.css';
import DropDownItem from './DropDownItem';

const Dropdown = ({id, expandedID, setExpandedID, options, defaultText}) => {


  const ref = useRef();
  const [selectedID, setSelectedID] = useState(-1)
  const [hoveredID, setHoveredID] = useState(-1)

  const [displayedText, setDisplayedText]  = useState(defaultText)
  
  const expanded = expandedID == id;


  
  function handleWindowClick(e) {

    console.log("in handling click");
    const mouseX = e.clientX;
    const mouseY = e.clientY;
  
    const bounds = ref.current.getBoundingClientRect();
  
    if (
      mouseX < bounds.left ||
      mouseX > bounds.right ||
      mouseY < bounds.top ||
      mouseY > bounds.bottom
    ) {

      e.preventDefault();
      setExpandedID(-1);
      console.log("about to remove the event listener");
      window.removeEventListener('click', handleWindowClick)

    }

    
  }


useEffect(()=>{


  console.log("in the use effect");
    if(expandedID == id){

        window.addEventListener('click', handleWindowClick)
    }
},[expandedID])


  
  const toggleExpand = () => {

    
    if(expanded){setExpandedID(-1)}
    else setExpandedID(id);

  }

useEffect(() => {

    if(selectedID == -1)setDisplayedText(defaultText);

    else setDisplayedText(options[selectedID].value)
  }, [selectedID]) 
  


  


  


  

  




  return (
    <div ref = {ref} className="dropdown" onClick={toggleExpand}>
      
      <div className = "dropdown-text">{displayedText}</div>
      {expanded && (
        <div className="dropdown-menu">

          {options.map((option, i)=>(
            <DropDownItem id = {i} 
              selectedID = {selectedID} hoveredID = {hoveredID} 
              setSelectedID = {setSelectedID} setHoveredID = {setHoveredID}
              option = {option}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;