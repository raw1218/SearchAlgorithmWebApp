import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { editorSelectionContext } from "./ForceGraphAndEditor";

const ForceGraphLink = forwardRef(
  ({ source, x1, x2, y1, y2, deleteLink, helper}, ref) => {
    const [selected, setSelected] = useState(false);
    const invisibleRef = useRef();

    const [animatedX1, setAnimatedX1] = useState(0)
    const [animatedY1, setAnimatedY1] = useState(0)
    const [animatedX2, setAnimatedX2] = useState(0)
    const [animatedY2, setAnimatedY2] = useState(0)

    const [visited,setVisited] = useState(false);

    const { editorSelection, setEditorSelection } = useContext(
      editorSelectionContext
    );

    //event listeners
    function handleMouseEnter(e) {
      setSelected(true);
    }

    function handleMouseLeave(e) {
      setSelected(false);
    }

    function handleTouchStart(e) {
      e.preventDefault();
      setSelected(true);
    }

    function handleTouchEnd(e) {
      setSelected(false);
    }

    function handleClick(e) {
      setSelected(false);

      if (editorSelection == "delete") {
        deleteLink();
      }
    }

    useEffect(() => {
      const link = invisibleRef.current;

      if (!link) return;

      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
      link.addEventListener("touchstart", handleTouchStart);
      link.addEventListener("touchend", handleTouchEnd);
      link.addEventListener("click", handleClick);

      return () => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
        link.removeEventListener("touchstart", handleTouchStart);
        link.removeEventListener("touchend", handleTouchEnd);
        link.removeEventListener("click", handleClick);
      };
    }, [deleteLink]);

    const startTimeRef = useRef(null);
    const animationTimeRef = useRef(0);
    const animationStateRef = useRef("not started");
    const animationReverseRef = useRef(false);

     function startAnimation(reverse, speed) {
     
     
      setAnimatedX2(x2);
      setAnimatedY2(y2);
     }





     /*useEffect(()=>{

        if(animationStateRef.current == "non started"){
          setAnimatedX1(x1);
          setAnimatedY1(y1);
          setAnimatedX2(x1);
          setAnimatedY2(y1);
        }


        if(animationStateRef.current == "completed"){
          setAnimatedX1(x1);
          setAnimatedX2(x2);
          setAnimatedY1(y1);
          setAnimatedY2(y2)
        }
     },[x1,x2,y1,y2, animationStateRef.current]) */
        

    const testing = (timeStamp,reverse) => {


      if(startTimeRef.current == null){

        startTimeRef.current = timeStamp;
      }

      const elapsedTime =    timeStamp - startTimeRef.current;
      let progress = elapsedTime / animationTimeRef.current;

   
      if(progress >=1){progress = 1;animationStateRef.current = "completed";}


      const newX2 = ((x2 - x1) *  progress) + x1;
      const newY2 = ((y2-y1) * progress) + y1;
      const newX2Rev = ((x1 - x2) * progress) + x2;
      const newY2Rev = ((y1 - y2) * progress) + y2;

      if(reverse){
        setAnimatedX1(x2);
        setAnimatedY1(y2);

        setAnimatedX2(newX2Rev)
        setAnimatedY2(newY2Rev);

      }

      else{
      

      
      setAnimatedX1(x1);
      setAnimatedX2(newX2);
      setAnimatedY1(y1);
      setAnimatedY2(newY2);}
    }


   if(animationStateRef.current == "started")requestAnimationFrame((timeStamp) => {testing(timeStamp,animationReverseRef.current)});

    useImperativeHandle(
      ref,
      () => {
        return {
          startAnimation: startAnimation,
          setVisited: setVisited,
          getSource: () => {
            return source;
          },
        };
      },
      []
    );

    const color = selected && editorSelection == "delete" ? "darkred" : "#B7AD99";
  return (
    <>
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth = {2}
      stroke= {color}
    />
           <line x1={x1} y1={y1} x2={visited ? x2 : x1} y2={visited ? y2: y1} stroke="#00D9C0" stroke-width="5" >

            </line>


    <line ref = {invisibleRef}
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    strokeWidth = {15}
    stroke= "transparent"

  /></>
  )



})

export default ForceGraphLink