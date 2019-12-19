import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';



const Epochs = props => {
  
  const addEpoch = (e, props) => {
    e.preventDefault()
    let index = props.epochs.length + 1;
    props.dispatch({
      type: 'ADD_EPOCH',
      value: {name: `Epoch ${index}`}
    })
  }

  const removeEpoch = (e, epochName) => {
    e.preventDefault()
    props.dispatch({
      type: 'REMOVE_EPOCH',
      value: {name: epochName}
    });
  }

  const updateEpoch = (epoch, epochIndex) => {
    let updatedEpochs = [...props.epochs]
    updatedEpochs[epochIndex] = epoch
    props.dispatch({
      type: "SET_EPOCH",
      value: epoch
    })
  }

  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      {props.epochs 
        ? props.epochs.map((epoch, idx) => {
        return <SoundChangeSuite 
          key={`epochname-${idx}`} epochIndex={idx} epoch={epoch} 
          updateEpoch={updateEpoch} removeEpoch={removeEpoch}
          // error={props.errors[epoch.name]}
        />}) 
        : <></>}
      <form onSubmit={e=>addEpoch(e, props)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </div>
  );
}

export default Epochs;