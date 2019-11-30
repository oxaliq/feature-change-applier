import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';

const addEpoch = (e, props) => {
  e.preventDefault()
  let index = props.epochs.length + 1;
  props.setEpochs([...props.epochs, {name: `epoch ${index}`, changes:['[+ feature]>[- feature]/_#']}])
}


const Epochs = props => {
  const removeEpoch = (e, epochName) => {
    e.preventDefault()
    let newEpochs = props.epochs.filter(epoch => epoch.name !== epochName);
    props.setEpochs(newEpochs)
  }
  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      {props.epochs ? props.epochs.map((epoch, idx) => <SoundChangeSuite key={`epochname-${idx}`} epoch={epoch} removeEpoch={removeEpoch}/>) : <></>}
      <form onSubmit={e=>addEpoch(e, props)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </div>
  );
}

export default Epochs;