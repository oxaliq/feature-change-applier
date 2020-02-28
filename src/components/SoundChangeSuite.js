import React, { useState, useEffect } from 'react';
import './SoundChangeSuite.scss';

const SoundChangeSuite = props => {
  const { epochIndex, error, removeEpoch, epochs } = props;
  const [ epoch, setEpoch ] = useState(props.epoch ? props.epoch : {name:'', changes:[''], parent:'none'});
  
  const changeHandler = (e,cb) => {
    cb(e);
    props.updateEpoch(epoch, epochIndex);
  }
  
  useEffect(() => {
    props.updateEpoch(epoch, epochIndex);
  }, [epoch])

  const renderOptionFromEpoch = thisEpoch => (
    <option 
      key={`${epoch.name}__parent-option--${thisEpoch.name}`}
      value={thisEpoch.name}
    >
      {thisEpoch.name}
    </option>
  )

  const replaceCurrentEpoch = thisEpoch => {
    if (thisEpoch.name === epoch.name) return {name: 'none'}
    return thisEpoch;
  }

  const isViableParent = thisEpoch => {
    if (thisEpoch.parent && thisEpoch.parent === epoch.name) return false;
    return true;
  }

  const parentsOptions = () => {
    return epochs.map(replaceCurrentEpoch).filter(isViableParent).map(renderOptionFromEpoch)
  }

  const renderParentInput = () => {
    if (epochIndex) return (
      <>
        <label htmlFor={`${epoch.name}-parent`}>
          Parent Epoch:
        </label>
        <select 
          name="parent"
          list={`${epoch.name}-parents-list`}
          value={epoch.parent || 'none'}
          onChange={e=>changeHandler(
            e, ()=>{
              console.log(e.target.value)
              setEpoch({...epoch, parent:e.target.value})
            })
          }
          >
          {parentsOptions()}
        </select>
      </>
    )
    return <></>
  }

  const renderError = () => {
    if (error) return (
      <p className="error">{error}</p>
    )
    return <></>
  }

  return (
    <>
      <h4>{epoch.name}</h4>
      {renderError()}
      <form className="SoundChangeSuite__form" data-testid={`${epoch.name}_SoundChangeSuite_changes`}>
        <label htmlFor={`${epoch.name}-name`}>
          Name: 
        </label>
        <input type="text" 
          name="epoch" 
          id={`${epoch.name}-name`} cols="30" rows="1" 
          value={epoch.name} 
          onChange={e=>changeHandler(
            e, () => {
              setEpoch({...epoch, name:e.target.value})
            }
          )} 
        ></input>
        {renderParentInput()}
        
        <textarea 
          name="changes" 
          id="" cols="30" rows="10" 
          value={epoch.changes.join('\n')} 
          onChange={e=> changeHandler(
            e, ()=>setEpoch(
              {...epoch, changes:e.target.value.split(/\n/).map(change=>change === ' ' 
                ? '[+ feature]>[- feature]/_#' 
                : change
              )}
            )
          )}
        ></textarea>
      </form>
      <form onSubmit={e=>removeEpoch(e, epoch.name)}>
        <input type="submit" name="remove-epoch" value={`remove ${epoch.name}`}></input>
      </form>
    </>
  );
}

export default SoundChangeSuite;