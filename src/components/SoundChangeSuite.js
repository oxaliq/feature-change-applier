import React from 'react';
import './SoundChangeSuite.scss';

const SoundChangeSuite = props => {
  return (
    <div className="SoundChangeSuite" data-testid="SoundChangeSuite">
      <h4>{props.epoch ? Object.keys(props.epoch)[0] : 'Changes'}</h4>
    </div>
  );
}

export default SoundChangeSuite;