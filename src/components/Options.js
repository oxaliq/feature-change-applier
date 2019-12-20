import React, { useState } from 'react';
import './Options.scss';
import ls from 'local-storage';

const Options = props => {
  const [ load, setLoad ] = useState('');

  const handleRadioChange = e => {
    const option = e.target.name;
    const setValue = e.target.id;
    props.dispatch({
      type: 'SET_OPTIONS',
      value: {
        option,
        setValue
      }
    });
  }
  
  const handleCheckChange = e => {
    const option = e.target.name;
    const setValue = e.target.checked ? 'true' : 'false';
    props.dispatch({
      type: 'SET_OPTIONS',
      value: {
        option,
        setValue
      }
    });
  }

  const handleFormSubmit = (e, options) => {
    e.preventDefault();
    props.dispatch({
      type: 'RUN',
      value: options
    });
  }

  return (
    <div className="Options" data-testid="Options">
      <h3>Modeling Options</h3>

      <form onSubmit={e=>handleFormSubmit(e, props.options)} data-testid="Options-form">
        
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
        
        <input type="submit" value="Run Changes"></input>
      </form>


      <form onSubmit={()=>{}}>
        <label>
          Load from a prior run:
          <select value={load} onChange={e=>setLoad(e.target.value)}>
            {localStorage.phonoChange 
              ? ls.get('phonoChange').map(priorRun => {
                return <option key={priorRun.name} value={priorRun.name}>{priorRun.name}</option>
              }
            ) : <></>}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Options;