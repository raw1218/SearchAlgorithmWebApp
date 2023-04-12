import React, { useEffect } from 'react'

const ForceGraphNewLine = ({x1,y1,x2,y2}) => {


if(x1 == null || x2 == null || y1 == null || y2 == null){
    return 
}





  return (
    <line className='ForceGraphNewLine'
        x1={x1} x2 = {x2 } y1 = {y1} y2 = {y2}
        stroke = "black"
        strokeWidth={5}
        >

        </line>
  )



}

export default ForceGraphNewLine