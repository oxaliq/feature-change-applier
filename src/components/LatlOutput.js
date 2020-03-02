import React from 'react';
import './LatlOutput.scss';

const LatlOutput = ({results, options, dispatch}) => {

  return (
    <div className="LatlOutput">
      <h3>Output</h3>
      <form>
        <input 
          className="form form--remove"
          type="submit"
          onClick={e=>{e.preventDefault()}}
          value="Clear"
          />

        <input 
          id="Parse"
          name="Parse"
          className="form form--add"
          type="submit"
          onClick={e=>{e.preventDefault()}}
          value="Parse"
          />
        
        <input 
          id="Run"
          name="Run"
          className="form form--add"
          type="submit"
          onClick={e=>{e.preventDefault()}}
          value="Run"
        />
      </form>
    </div>
  );
}

export default LatlOutput;