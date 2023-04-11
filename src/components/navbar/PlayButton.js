import React, { useState, useContext, useEffect , useRef} from 'react';
import { algorithmRefContext, updateContext } from '../AppWindow';
import Slider from '../misc/Slider';
import Algorithm from '../../classes/Algorithm';

function PlayButton({id,selectedID,setSelectedID}) {

  
  const {update,setUpdate} = useContext(updateContext)

    const {algorithmRef} = useContext(algorithmRefContext);

    
    const maxSpeed = 300;
    const minSpeed = 35;
    const [speed,setSpeed] = useState((maxSpeed + minSpeed) / 2);
    const [speedText, setSpeedText] = useState();

    const [finished,setFinished] = useState(false);

    const [text,setText] = useState("Start Search");

    const startedRef = useRef(false);
    const [attemptedStart, setAttemptedStart] = useState(false);
    const [searching,setSearching] = useState(false);

    
    useEffect(()=>{

      if(finished)return;
      if(startedRef.current)algorithmRef.current.startSearch(minSpeed + (maxSpeed - speed), setFinished);


      if(speed > 200)setSpeedText("Fast")
      else if (speed > 100)setSpeedText("Med.")
      else setSpeedText("Slow")
    },[speed])


    const startAlgorithm = () => {

      algorithmRef.current.startSearch(minSpeed + (maxSpeed - speed), setFinished);
        startedRef.current = true;
        setSearching(true);
    }


    const handleClick = () => {


      setSelectedID(id);

      if(finished){
        algorithmRef.current.resetNodes();


        const classType = algorithmRef.current.constructor
        const newAlg = new classType({graph: algorithmRef.current.graph})
        newAlg.start = algorithmRef.current.start;
        newAlg.end = algorithmRef.current.end;

        algorithmRef.current = newAlg;
        
        setFinished(false);
        setSearching(false);
        return;
      }


      setAttemptedStart(true)
      const type = algorithmRef.current.type
      const start = algorithmRef.current.start
      const end = algorithmRef.current.end

      if((type != "Algorithm") && (start != null) && (end != null)){
        
       
        startAlgorithm();
    


      

    }}


    useEffect(()=> {
   
    let b = attemptedStart

    if(!b)setText("Start Search");

    
    console.log("in the useEffect b = ", b)
    if(b && algorithmRef.current.type == "Algorithm"){setText("No Algorithm Selected");return;}
    
    if(b && algorithmRef.current.start == undefined){setText("No Start Node Selected");return;}

    if(b && algorithmRef.current.end == undefined){setText("No End Node Selected");return;}


    if(b && !searching)setText("Start Search")
    if(searching)setText("Searching");
},  [algorithmRef.current.type, algorithmRef.current.start, algorithmRef.current.end, attemptedStart, searching, update])
 



const className = "PlayButton " + (searching ? "searching " : "")
  return (

    <div className = "PlayButtonContainer">
    <button className={className} onClick={handleClick}>


   

      
      
      {finished ? "↻" : text}
    </button>


 
    <Slider min = {minSpeed} max = {maxSpeed} value = {speed} setValue = {setSpeed}/>
    
    </div>
  );
}

export default PlayButton;