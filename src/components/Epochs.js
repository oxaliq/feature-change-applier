import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';
import { render } from 'react-dom';



const Epochs = ({epochs, errors, dispatch}) => {
  
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
      changes: epoch.changes,
      parent: epoch.parent
    }
    dispatch({
      type: "SET_EPOCH",
      value: dispatchValue
    })
  }
  
  const renderAddEpochButton = index => {
    if (epochs && index === epochs.length - 1 ) return (
      <form onSubmit={e=>addEpoch(e)}>
        <input className="form form--add" type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    )
    return <></>
  }

  const renderEpochs = () => {
    if (epochs && epochs.length) return epochs.map((epoch, index) => {
      const epochError = errors.epoch ? errors.error : null
      return (
      <div 
        className="SoundChangeSuite" 
        data-testid={`${epoch.name}_SoundChangeSuite`}
        key={`epoch-${index}`}
      >
        <SoundChangeSuite 
          epochIndex={index} epoch={epoch} 
          updateEpoch={updateEpoch} removeEpoch={removeEpoch}
          epochs={epochs}
          error={epochError}
        />
        {renderAddEpochButton(index)}
      </div>
    )});
    return renderAddEpochButton(-1)
  }

  return (
    <>
      { renderEpochs() }
    </>
  );
}

export default Epochs;