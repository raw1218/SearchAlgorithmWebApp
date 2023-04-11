import React, { useEffect, useRef, useState } from 'react'



const DropDownItem = ({option,id, selectedID, setSelectedID, hoveredID, setHoveredID}) => {

//option has attributes label, value, and function

    const ref = useRef();


    const [selected,setSelected] = useState(false)
    const [hovered,setHovered] = useState(false)


    useEffect(() => {
      setSelected(selectedID == id)
      setHovered(hoveredID == id)
    }, [selectedID, hoveredID])


    const select = () => {
      setSelectedID(id); 
      option.function();}
    
    const hover = () => {
      setHoveredID(id);
    }


    //event listeners

    function handleClick(){
      select();
    }
    function handleMouseEnter(){
      hover();
    }
    function handleMouseLeave(){
      if(hovered)setHoveredID(-1);
    }

    useEffect(() => {
    
      const item = ref.current;
      if(!item)return;

      item.addEventListener('click',handleClick)
      item.addEventListener('mouseenter', handleMouseEnter)
      item.addEventListener('mouseleave',handleMouseLeave)
      
    
      return () => {
        item.removeEventListener('click',handleClick)
        item.removeEventListener('mouseenter',handleMouseEnter)
        item.removeEventListener('mouseleave',handleMouseLeave)
      }
    }, [hovered])


    const className = "dropdown-item " + (selected? "selected " : "unselected ") + (hovered? "hovered " : "unhovered ")
    

  return (

    <div ref = {ref} className = {className}>{option.name}</div>

  )


}

export default DropDownItem