import React from 'react';
import './Latl.scss';

const Latl = ({latl, dispatch}) => {
  const { innerWidth, innerHeight } = window;
  console.log(innerWidth, innerHeight)
  return (  
    <div className="Latl">
      <h3>.LATL</h3>
      <textarea name="latl" id="latl" 
      cols={'' + Math.floor(innerWidth / 15)} rows={'' + Math.floor(innerHeight / 30)}
      />
    </div>
  );
}

export default Latl;