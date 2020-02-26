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

  const renderEpochs = () => {
    if (epochs) return epochs.map((epoch, index) => (
    <SoundChangeSuite 
      key={`epoch-${index}`} epochIndex={index} epoch={epoch} 
      updateEpoch={updateEpoch} removeEpoch={removeEpoch}
      // error={errors[epoch.name]}
    />
  ));
  }

  return (
    <>
      { renderEpochs() }
      <form onSubmit={e=>addEpoch(e)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </>
  );
}

export default Epochs;