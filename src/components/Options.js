import React from 'react';
import './Options.scss';

const Options = props => {
  return (
    <div className="Options" data-testid="Options">
      <h3>Modeling Options</h3>
      <form onSubmit={()=>{}}>
        
        {/* <h5>Output</h5> */}

        <input 
          type="radio" name="output" id="output-default" defaultChecked
        />
        <label htmlFor="output-default">Default 
          <span className="Options__output-example"> output</span>
        </label>
        
        <input 
          type="radio" name="output" id="output-proto" 
        />
        <label htmlFor="output-proto">Proto 
          <span className="Options__output-example"> output [proto]</span>
        </label>
        
        <input 
          type="radio" name="output" id="output-diachronic" 
        /><label htmlFor="output-diachronic">Diachronic 
            <span className="Options__output-example"> *proto > *epoch > output</span>
          </label>
        
        <input 
          type="checkbox" name="save" 
        />
          <label htmlFor="save">Store session on Run</label>
        
        <input type="submit"></input>
      </form>
    </div>
  );
}

export default Options;