import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';

const addEpoch = (e, props) => {
  console.log(props)
  e.preventDefault()
  props.setEpochs([...props.epochs, {name: '', changes:['']}])
  console.log(props)
}

const Epochs = props => {
  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      {props.epochs ? props.epochs.map((epoch, idx) => <SoundChangeSuite key={`epochname-${idx}`} epoch={epoch}/>) : <></>}
      <form onSubmit={e=>addEpoch(e, props)}>
        <input type="submit" name="add-epoch" value="Add Epoch" ></input>
      </form>
    </div>
  );
}

export default Epochs;