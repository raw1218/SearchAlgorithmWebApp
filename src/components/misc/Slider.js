import React, { useState } from 'react';
import './Slider.css';

function Slider({ min, max, value, setValue }) {

  function handleChange(event) {
    setValue(event.target.value);
  }

  const speedText = "SPEED".split("").map((char, index) => (
    <span key={index}>{char}</span>
  ));

  return (
    <div className="slider-container" style={{ position: 'relative' }}>
      <div
        className="speed-text"
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        {speedText}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="slider"
        style={{ position: 'relative' }}
      />
    </div>
  );
}

export default Slider;
