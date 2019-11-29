import React from 'react';
import './Epochs.scss';

import SoundChangeSuite from './SoundChangeSuite';

const Epochs = () => {
  return (
    <div className="Epochs" data-testid="Epochs">
      <h3>Sound Change Epochs</h3>
      <SoundChangeSuite />
    </div>
  );
}

export default Epochs;