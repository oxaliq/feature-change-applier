import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';

const Epochs = props => {
  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      {props.epochs ? props.epochs.map(epoch => <SoundChangeSuite key={epoch.name} epoch={epoch}/>) : <></>}
    </div>
  );
}

export default Epochs;