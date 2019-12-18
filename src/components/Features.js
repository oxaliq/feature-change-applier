// @flow
import React, {useState} from 'react';
import './Features.scss';

import type { featureAction } from '../reducers/stateReducer.features';

const parsePhonesFromFeatureObject = featureObject => {
  
  const getFeatureMap = (featureObject) => {
    return Object.keys(featureObject).map(feature => {
      const plusPhones = featureObject[feature].positive.map(phone => phone.grapheme).join('|');
      const minusPhones = featureObject[feature].negative.map(phone => phone.grapheme).join('|');
      return {[feature]: {plus: plusPhones, minus: minusPhones}}
    })
  }

  const getFeatureMapJSX = (featureMap) => {
    return featureMap.map((feature, index) => {
      const featureName = Object.keys(feature)
      const plusPhones = feature[featureName].plus;
      const minusPhones = feature[featureName].minus;
      return (
        <li key={`feature__${featureName}`}>
          <span className="plus-phones">{`[+ ${featureName}] = ${plusPhones}`}</span>
          <span className="minus-phones">{`[- ${featureName}] = ${minusPhones}`}</span>
        </li>
      )
    })
  }

  const featureMap = getFeatureMap(featureObject);
  console.log(featureMap)
  const featureMapJSX = getFeatureMapJSX(featureMap);
  return featureMapJSX;
}

const parseFeaturesFromPhonemeObject = phonesObject => {

  const getFeatureMap = (phonesObject) => {
    return Object.keys(phonesObject).reduce((featureObject, phoneName) => {
      let phone = phonesObject[phoneName];
      Object.keys(phone.features).forEach(feature => {
        if (!featureObject[feature]) featureObject[feature] = {plus: [], minus: []}
        if (phone.features[feature]) featureObject[feature].plus.push(phone.grapheme)
        else featureObject[feature].minus.push(phone.grapheme)
      });
      return featureObject;
    }, {})
  }

  const getFeatureMapJSX = (featureMap) => {
    return Object.keys(featureMap).map(feature => {
      const plusPhones = featureMap[feature].plus.join('|');
      const minusPhones = featureMap[feature].minus.join('|');
      return (
        <li key={`feature__${feature}`}>
          <span className="plus-phones">{`[+ ${feature}] = ${plusPhones}`}</span>
          <span className="minus-phones">{`[- ${feature}] = ${minusPhones}`}</span>
        </li>
      )
    });
  }

  const featureMap = getFeatureMap(phonesObject);
  const featureMapJSX = getFeatureMapJSX(featureMap);
  return featureMapJSX;
}

const buildReducerAction = (e, newPositivePhones, newNegativePhones, feature): featureAction => {
  e.preventDefault();
  const positivePhones = []
  newPositivePhones !== '' 
    ? newPositivePhones.split('/').forEach(phone => positivePhones.push(phone.trim()))
    : positivePhones.push('')
    
  const negativePhones = []
  newNegativePhones !== '' 
    ? newNegativePhones.split('/').forEach(phone => negativePhones.push(phone.trim()))
    : negativePhones.push('')

  return {
    type: "ADD_FEATURE",
    value: {
      positivePhones,
      negativePhones,
      feature
    }
  }
}

const getPhonemesFromFeatureSubmission = (props, newPhonemes, feature) => {
  let newPhonemeObject = newPhonemes.split('/').reduce((phonemeObject, newPhoneme) => {
    newPhoneme = newPhoneme.trim();
    phonemeObject = phonemeObject[newPhoneme]
      ? {...phonemeObject, [newPhoneme]: [...phonemeObject[newPhoneme], feature]}
      : {...phonemeObject, [newPhoneme]: [feature]}
    return phonemeObject;
  }, {...props.phonemes})
  return newPhonemeObject;
}

const Features = (props) => {
  const [feature, setFeature] = useState('aspirated')
  const [ newPositivePhones, setNewPositivePhones ] = useState('tʰ / pʰ / kʰ');
  const [ newNegativePhones, setNewNegativePhones ] = useState('t / p / k');
  
  const newFeaturesSubmit = e => {
    e.preventDefault();
    
    // let newPhonemeObject = getPhonemesFromFeatureSubmission(props, newPhonemes, feature);
    // props.setPhonemes(newPhonemeObject);
    // if (!props.features || !props.features.includes(feature)) props.setFeatures([...props.features, feature])
    
    setFeature('');
    setNewPositivePhones('');
    setNewNegativePhones('');
  }

  return (
    <div className="Features" data-testid="Features">
      
      <h3>Phonetic Features</h3>
      
      <ul className="Features__list" data-testid="Features-list">
        {props.phones ? <>{parsePhonesFromFeatureObject(props.features)}</> : <></>}
      </ul>

      <form className="Features__form" data-testid="Features-form">
        <input 
          type="text" name="feature" 
          value={feature} onChange={e=> setFeature(e.target.value)}
          ></input>

        {/* ! Positive Phones */}
        <label htmlFor="positive-phones">+</label>
        <input 
          id="positive-phones"
          type="text" name="phonemes" 
          value={newPositivePhones} onChange={e=> setNewPositivePhones(e.target.value)}
        ></input>
        
        {/* ! Negative Phones */}
        <label htmlFor="negative-phones">-</label>
        <input 
          id="negative-phones"
          type="text" name="phonemes" 
          value={newNegativePhones} onChange={e=> setNewNegativePhones(e.target.value)}
        ></input>

        <input 
          type="submit" 
          onClick={e => props.dispatch(buildReducerAction(e, newPositivePhones, newNegativePhones, feature))} 
          value="Add feature"
        ></input>
      </form>

    </div>
  );
}

export default Features;