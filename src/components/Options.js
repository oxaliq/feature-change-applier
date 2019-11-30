import React from 'react';
import './Options.scss';

const Options = props => {
  const handleRadioChange = e => {
    props.setOptions({...props.options, [e.target.name]: e.target.id})
  }

  const handleCheckChange = e => {
    props.setOptions({...props.options, [e.target.name]: e.target.checked})
  }

  return (
    <div className="Options" data-testid="Options">
      <h3>Modeling Options</h3>
      <form onSubmit={()=>{}} data-testid="Options-form">
        
        {/* <h5>Output</h5> */}

        <input 
          type="radio" name="output" id="default" 
          checked={props.options ? props.options.output === 'default' : true}
          onChange={e=>handleRadioChange(e)}
          />
        <label htmlFor="default">Default 
          <span className="Options__output-example"> output</span>
        </label>
        
        <input 
          type="radio" name="output" id="proto" 
          checked={props.options ? props.options.output === 'proto' : false}
          onChange={e=>handleRadioChange(e)}
          />
        <label htmlFor="proto">Proto 
          <span className="Options__output-example"> output [proto]</span>
        </label>
        
        <input 
          type="radio" name="output" id="diachronic" 
          checked={props.options ? props.options.output === 'diachronic' : false}
          onChange={e=>handleRadioChange(e)}
        />
        <label htmlFor="diachronic">Diachronic 
          <span className="Options__output-example"> *proto > *epoch > output</span>
        </label>
        
        <input 
          type="checkbox" name="save"
          checked={props.options ? props.options.save : false}
          onChange={e=>handleCheckChange(e)}
        />
        <label htmlFor="save">Store session on Run</label>
        
        <input type="submit"></input>
      </form>
    </div>
  );
}

export default Options;