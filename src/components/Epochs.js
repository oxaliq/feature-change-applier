import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';
import { render } from 'react-dom';



const Epochs = ({epochs, dispatch}) => {
  
  const addEpoch = e => {
    e.preventDefault()
    let index = epochs.length + 1;
    dispatch({
      type: 'ADD_EPOCH',
      value: {name: `Epoch ${index}`}
    })
  }

  const removeEpoch = (e, epochName) => {
    e.preventDefault()
    dispatch({
      type: 'REMOVE_EPOCH',
      value: {name: epochName}
    });
  }

  const updateEpoch = (epoch, epochIndex) => {
    const dispatchValue = {
      name: epoch.name,
      index: epochIndex,
      changes: epoch.changes
    }
    dispatch({
      type: "SET_EPOCH",
      value: dispatchValue
    })
  }

  const renderEpochs = () => epochs.map((epoch, index) => (
    <SoundChangeSuite 
      key={`epochname-${index}`} epochIndex={index} epoch={epoch} 
      updateEpoch={updateEpoch} removeEpoch={removeEpoch}
      // error={errors[epoch.name]}
    />
  ))

  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      { epochs ? renderEpochs() : <></> }
      <form onSubmit={e=>addEpoch(e)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </div>
  );
}

export default Epochs;