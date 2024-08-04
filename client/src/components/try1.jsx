import React from 'react';
import { images } from './cardIndex';


function Try() {
  return (
    <div className="App">
      <header className="App-header" style={{backgroundColor:"black"}}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Example ${index + 1}`} height='75px'/>
        ))}
      </header>
    </div>
  );
}

export default Try;
