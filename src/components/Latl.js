import React from 'react';
import './Latl.scss';

const Latl = ({latl, dispatch}) => {
  const { innerWidth, innerHeight } = window;
  
  const handleChange = e => {
    console.log(e.target.value)
    const setLatlAction = {
      type: 'SET_LATL',
      value: e.target.value
    }
    dispatch(setLatlAction)
  }

  return (  
    <div className="Latl">
      <h3>.LATL</h3>
      <textarea name="latl" id="latl" 
        cols={'' + Math.floor(innerWidth / 15)} rows={'' + Math.floor(innerHeight / 30)}
        onChange={e => dispatch({type:'SET_LATL', value: e.target.value})}
      />
    </div>
  );
}

export default Latl;