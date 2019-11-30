import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';



const Epochs = props => {
  
  const addEpoch = (e, props) => {
    e.preventDefault()
    let index = props.epochs.length + 1;
    props.setEpochs([...props.epochs, {name: `epoch ${index}`, changes:['[+ feature]>[- feature]/_#']}])
  }

  const removeEpoch = (e, epochName) => {
    e.preventDefault()
    let newEpochs = props.epochs.filter(epoch => epoch.name !== epochName);
    props.setEpochs(newEpochs)
  }

  const updateEpoch = (epoch, epochIndex) => {
    let updatedEpochs = [...props.epochs]
    updatedEpochs[epochIndex] = epoch
    props.setEpochs(updatedEpochs)
  }

  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      {props.epochs 
        ? props.epochs.map((epoch, idx) => {
        return <SoundChangeSuite 
          key={`epochname-${idx}`} epochIndex={idx} epoch={epoch} 
          updateEpoch={updateEpoch} removeEpoch={removeEpoch}
          error={props.errors[epoch.name]}
        />}) 
        : <></>}
      <form onSubmit={e=>addEpoch(e, props)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </div>
  );
}

export default Epochs;