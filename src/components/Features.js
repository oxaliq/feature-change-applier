import React, {useState} from 'react';
import './Features.scss';

const parseFeaturesFromPhonemeObject = phonemeObject => {
  let featureMap = Object.keys(phonemeObject).reduce((featureObject, phonemeName) => {
    let phoneme = phonemeObject[phonemeName];
    phoneme.forEach(feature => {
      featureObject[feature] ? featureObject[feature].push(phonemeName) : featureObject[feature] = [ phonemeName ]
    });
    return featureObject;
  },{})
  return Object.keys(featureMap).map(feature => <li key={`feature__${feature}`}>{`[+ ${feature}] = `}{featureMap[feature].join('|')}</li>);
}

const Features = (props) => {
  const [feature, setFeature] = useState('nasal')
  const [newPhonemes, setNewPhonemes] = useState('n / m / ŋ')

  const newFeaturesSubmit = e => {
    e.preventDefault();
    
    let newPhonemeObject = newPhonemes.split('/').reduce((phonemeObject, newPhoneme) => {
      // console.log([...phonemeObject[newPhoneme], feature])
      newPhoneme = newPhoneme.trim();
      phonemeObject = phonemeObject[newPhoneme]
        ? {...phonemeObject, [newPhoneme]: [...phonemeObject[newPhoneme], feature]}
        : {...phonemeObject, [newPhoneme]: [feature]}
      return phonemeObject;
    }, {...props.phonemes})
    
    props.setPhonemes(newPhonemeObject);

    setFeature('');
    setNewPhonemes('');
  }

  return (
    <div className="Features" data-testid="Features">
      <h3>Phonetic Features</h3>
      <ul className="Features__list" data-testid="Features-list">
        {props.phonemes ? <>{parseFeaturesFromPhonemeObject(props.phonemes)}</> : <></>}
      </ul>
      <form className="Features__form" data-testid="Features-form">
        <input 
          type="text" name="feature" 
          value={feature} onChange={e=> setFeature(e.target.value)}
        ></input>
        <input type="text" name="phonemes" value={newPhonemes} onChange={e=> setNewPhonemes(e.target.value)}></input>
        <input type="submit" onClick={newFeaturesSubmit} value="Add feature"></input>
      </form>
    </div>
  );
}

export default Features;