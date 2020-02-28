import React, { useState } from 'react';
import './Options.scss';
import ls from 'local-storage';

const Options = ({ options, dispatch }) => {
  const [ load, setLoad ] = useState('');

  const handleRadioChange = e => {
    const { name, id } = e.target;
    dispatch({
      type: 'SET_OPTIONS',
      value: {
        option: name,
        setValue: id
      }
    });
  }
  
  const handleFormSubmit = (e, options) => {
    e.preventDefault();
    dispatch({
      type: 'RUN',
      value: options
    });
  }

  const handleOutputClearSubmit = e => {
    e.preventDefault();
    console.log('clearing')
    dispatch({
      type: 'CLEAR',
      value: {}
    });
  }

  return (
    <div className="Options" data-testid="Options">
      <h3>Modeling Options</h3>

      <form onSubmit={e=>handleFormSubmit(e, options)} data-testid="Options-form">
        <input 
          type="radio" name="output" id="default" 
          checked={options ? options.output === 'default' : true}
          onChange={e=>handleRadioChange(e)}
        />
        <label htmlFor="default">Default 
          <span className="Options__output-example"> output</span>
        </label>
        
        {/* <input 
          type="radio" name="output" id="proto" 
          checked={options ? options.output === 'proto' : false}
          onChange={e=>handleRadioChange(e)}
          />
        <label htmlFor="proto">Proto 
          <span className="Options__output-example"> output [proto]</span>
        </label>
        
        <input 
          type="radio" name="output" id="diachronic" 
          checked={options ? options.output === 'diachronic' : false}
          onChange={e=>handleRadioChange(e)}
        />
        <label htmlFor="diachronic">Diachronic 
          <span className="Options__output-example"> *proto > *epoch > output</span>
        </label> */}
        
        <input type="submit" value="Run Changes"></input>
        <input type="button" value="Clear Output" onClick={e=>handleOutputClearSubmit(e)}/>
      </form>


      {/* <form onSubmit={()=>{}}>
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
      </form> */}
    </div>
  );
}

export default Options;