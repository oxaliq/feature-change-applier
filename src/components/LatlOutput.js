import React from 'react';
import './LatlOutput.scss';
import Output from './Output';

const LatlOutput = ({results, options, dispatch, errors}) => {
  const handleClick = e => dispatchFunc => {
    e.preventDefault()
    return dispatchFunc();
  }

  const dispatchClear = () => {
    const clearAction = {
      type: 'CLEAR',
      value: {}
    }
    dispatch(clearAction)
  }

  const dispatchParse = () => {
    const parseAction = {
      type: 'PARSE_LATL',
      value: {}
    }
    dispatch(parseAction)
  }

  const dispatchRun = () => {
    const runAction = {
      type: 'RUN',
      value: {}
    }
    dispatch(runAction)
  }

  return (
    <div className="LatlOutput">
      <h3>Output</h3>
      <form>
        <input 
          className="form form--remove"
          type="submit"
          onClick={e=>handleClick(e)(dispatchClear)}
          value="Clear"
          />

        <input 
          id="Parse"
          name="Parse"
          className="form form--add"
          type="submit"
          onClick={e=>handleClick(e)(dispatchParse)}
          value="Parse"
          />
        
        <input 
          id="Run"
          name="Run"
          className="form form--add"
          type="submit"
          onClick={e=>handleClick(e)(dispatchRun)}
          value="Run"
        />
      </form>
      <Output results={results} errors={errors} options={options}/>
    </div>
  );
}

export default LatlOutput;