import React, { useState, useRef, useEffect , useContext, forwardRef, useImperativeHandle} from 'react'
import { editorSelectionContext } from './ForceGraphAndEditor'
import { algorithmRefContext } from '../AppWindow'



import { updateContext } from '../AppWindow'


const ForceGraphNode = forwardRef(({key, x, y, r, collisionRadius,  id, deleteNode, scale, snapNewLineStartToNode, 
    snapNewLineEndToNode, isDrawingNewLinkRef, newLinkSourceIDRef, newLinkTargetIDRef,
     startIDRef, endIDRef}, ref) => {


    const {update,setUpdate} = useContext(updateContext)

    const {algorithmRef} = useContext(algorithmRefContext)


    const [type,setType] = useState('none')


    const [selected, setSelected] = useState(false)
    const [hovered, setHovered] = useState(false)

    const nodeRef = useRef();
    const hoverRef = useRef();
    const linkHoverRef = useRef();
    
    const {editorSelection,setEditorSelection} = useContext(editorSelectionContext)

//useEffect that updates new link if it is snapped to node
    const isStartSnappedRef = useRef(false);
    const isEndSnappedRef = useRef(false);

    useEffect(()=> {

        if(newLinkSourceIDRef.current == id){
            snapNewLineStartToNode()
        }

        if(newLinkTargetIDRef.current == id){
            console.log("snapping end, target id = ", newLinkTargetIDRef.current)
            console.log("and the value of isEndSnapped = ", isEndSnappedRef.current)
            snapNewLineEndToNode()
        }
    }, [x,y, newLinkSourceIDRef.current, newLinkTargetIDRef.current  ])

    useEffect(() => {

        
        //console.log("newLinkSourceID = ", newLinkSourceIDRef.current, "target = ", newLinkTargetIDRef.current)
        isStartSnappedRef.current = (newLinkSourceIDRef.current == id)
        isEndSnappedRef.current = (newLinkTargetIDRef.current == id)

        if(newLinkTargetIDRef.current == id){
            console.log("checking if I should snap, link target = ", newLinkTargetIDRef)
        }
        
    }, [newLinkSourceIDRef.current, newLinkTargetIDRef.current])





    
    const select = () => {

        setUpdate(!update)
        
        if(editorSelection == 'delete'){
            
            deleteNode();
        }


        if(editorSelection == 'start')
        {
            setType('start')
            startIDRef.current = id;
            algorithmRef.current.start = id;
            
        }
        if(editorSelection == 'end'){
            setType('end')
            endIDRef.current = id;
            algorithmRef.current.end = id;
        }

        setHovered(false)
 }



 useEffect(()=>{

    if(type == "start"){
        if(startIDRef.current != id)setType("none");
    }

    if(type == "end"){
        if(endIDRef.current != id)setType("none");
    }
 }, [startIDRef.current, endIDRef.current])

    const handleClick = () => {
        select();
        
 }



    //event listeners
    function handleMouseEnter(e){
       
        console.log("handling mouseEnter Link, drawref = ", isDrawingNewLinkRef.current)
        
        setHovered(true)
        if(editorSelection == 'addLink'){
            
        
            if(isDrawingNewLinkRef.current){
                snapNewLineEndToNode();
                newLinkTargetIDRef.current = id;
                console.log("nweLinkTarget = ", newLinkTargetIDRef.current)
            }  }
        
    }




    

    function handleMouseLeave(){

        newLinkTargetIDRef.current = null;

        console.log("handlingMouseleavelink, newLinkTarget = ", newLinkTargetIDRef.current)
        setHovered(false)

    }

    function handleMouseDown(e){
       
        if(editorSelection == 'addLink'){

            


            isDrawingNewLinkRef.current = true;
            newLinkSourceIDRef.current = id;
            snapNewLineStartToNode();
        }
    }




    function handleTouchStart(event){
        event.preventDefault()
        setSelected(true)
        setHovered(true)
        if(editorSelection == 'addLink'){
            isDrawingNewLinkRef.current = true;
            snapNewLineStartToNode()
        }

    }


    function handleTouchEnd(){
        select();

        
    }



    useEffect( () => {
        const hoverNode = hoverRef.current
        
        if(!hoverNode)return;
      
        hoverNode.addEventListener('mouseenter', handleMouseEnter)
        hoverNode.addEventListener('mouseleave', handleMouseLeave)
        hoverNode.addEventListener('mousedown', handleMouseDown)
        hoverNode.addEventListener('touchstart', handleTouchStart)
        hoverNode.addEventListener('touchend',handleTouchEnd)
        hoverNode.addEventListener('click',handleClick)



        

        return () => {
            hoverNode.removeEventListener('mouseenter', handleMouseEnter)
            hoverNode.removeEventListener('mouseleave', handleMouseLeave)
            hoverNode.removeEventListener('mousedown',handleMouseDown)
            hoverNode.removeEventListener('touchstart', handleTouchStart)
            hoverNode.removeEventListener('touchend', handleTouchEnd)
            hoverNode.removeEventListener('click',handleClick)


        }
    }, [handleClick, newLinkTargetIDRef, editorSelection, deleteNode,  handleMouseEnter, handleMouseLeave, ])
    

    useImperativeHandle(ref,
      () => {
        
        return {
            setType : (t) => {console.log("setting type of id = ", id);setType(t);},
            getType : ()=>{return type}
        }
      },
      [type])



    let color;

    if(type == "none")color = "#FFFFF3";
    if(type == "delete")color = "darkred";
    if(type == "addLink")color = "black";
    if(type == "start")color = "green";
    if(type == "end")color = "red";

    if(hovered && type != editorSelection)color = "#00D9C0";
    if(hovered && editorSelection == 'addLink')color = "black";
    if(hovered && editorSelection == 'delete')color = "darkred";


    const shouldBorder = (type == "none" && !hovered);

    const style = {

        fill:color,
        stroke: (shouldBorder? "":"none")

    }

    const className = "ForceGraphNodeCircle " + (hovered ? "hovered " + editorSelection : type)

  return (
    <>
    <circle  className = {className} ref = {nodeRef} style={style}
        key= {key}
        cx= {x}
        cy= {y}
        r= {r}
        
      
    />

    <circle ref = {hoverRef}
        cx = {x}
        cy = {y}
        r = { (scale < 1) ? (r * (1/scale)) : r}
        fill = "transparent"
        ></circle>



   

</>
  )
} )

export default ForceGraphNode