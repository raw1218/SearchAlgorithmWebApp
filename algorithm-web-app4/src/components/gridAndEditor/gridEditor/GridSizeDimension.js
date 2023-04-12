import React, { useState, useRef, useEffect } from 'react';
import './GridSizeEditor.css';


const GridSizeDimension = (props) => {
  const [val, setVal] = [props.val, props.setVal] 
  const [height, setHeight] = useState();
  const inputRef = useRef();
  const setSubmitTop = props.setSubmitTop;

  const min = 5;
  const max = 30;

  useEffect(()=>{

    if(val < min)setVal(min);
    if(val > max)setVal(max);
  },[val])
  

  function increment(){
    setSubmitTop(false);
    setVal(val +1);
    
  }

  function decrement(){
    setSubmitTop(true);
   setVal(val-1);
   
  }

  useEffect(() => {
    if (inputRef.current) {
      setHeight(inputRef.current.clientHeight);
    }
  }, []);

  const styles = { fontSize: height * .5 + 'px' };

  return (
    <div className='dimension' >
      <button className='dimensionButtonUp' onClick={increment} >
        +
      </button>
      <label className = "dimensionLabel">
        <input
        min = {5} max = {30} step="any"
        ref={inputRef}
          style={styles}
          className='dimensionInput'
          type='number'
          value={val}
          onChange={(event) => { setVal(parseInt(event.target.value)) }}
        />
      </label>
      <button className='dimensionButtonDown' onClick={decrement}>
        -
      </button>
    </div>
  );
};

export default GridSizeDimension;