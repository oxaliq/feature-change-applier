import React, {useState} from 'react';
import './Features.scss';

const parseFeaturesFromPhonemeList = phonemeList => {
  let featureMap = phonemeList.reduce((featureObject, phonemeObject) => {
    let phoneme = Object.keys(phonemeObject)[0];
    phonemeObject[phoneme].forEach(feature => {
      featureObject[feature] ? featureObject[feature].push(phoneme) : featureObject[feature] = [ phoneme ]
    });
    return featureObject;
  },{})
  console.log(featureMap)
  return Object.keys(featureMap).map(feature => <li key={`feature__${feature}`}>{`[+ ${feature}] = `}{featureMap[feature].join('|')}</li>);
}

const Features = (props) => {
  const {feature, setFeature} = useState('[+ nasal]')
  const {newPhonemes, setNewPhonemes} = useState('n / m / ŋ')

  return (
    <div className="Features" data-testid="Features">
      <h3>Phonetic Features</h3>
      <ul className="Features__list" data-testid="Features-list">
        {props.phonemes ? <>{parseFeaturesFromPhonemeList(props.phonemes)}</> : <></>}
      </ul>
      {/* <form className="Features__form" data-testid="Features-form">
        
      </form> */}
    </div>
  );
}

export default Features;