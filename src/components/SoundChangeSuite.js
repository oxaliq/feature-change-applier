import React from 'react';
import './SoundChangeSuite.scss';

const SoundChangeSuite = props => {
  let epochName = props.epoch ? Object.keys(props.epoch)[0] : 'Changes';
  return (
    <div className="SoundChangeSuite" data-testid={`${epochName}_SoundChangeSuite`}>
      <h4>{epochName}</h4>
      <form className="SoundChangeSuite__form" data-testid={`${epochName}_SoundChangeSuite_changes`}>
        <textarea name="changes" id="" cols="30" rows="10" value={props.epoch ? props.epoch[epochName][0] : ''} onChange={e=>e.target.value}></textarea>
      </form>
    </div>
  );
}

export default SoundChangeSuite;