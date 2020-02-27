// @flow
import React, {useState} from 'react';
import './Features.scss';

import type { featureAction } from '../reducers/reducer.features';

const parsePhonesFromFeatureObject = featureObject => {
  const getProperty = property => object => object[property]
  
  const getFeatureMap = (featureObject) => {
    return Object.keys(featureObject).map(feature => {
      const plusPhones = featureObject[feature].positive.map(getProperty('grapheme')).join(' / ');
      const minusPhones = featureObject[feature].negative.map(getProperty('grapheme')).join(' / ');
      return {[feature]: {plus: plusPhones, minus: minusPhones}}
    })
  }

  const getFeatureMapJSX = (featureMap) => {
    return featureMap.map((feature, index) => {
      const featureName = Object.keys(feature);
      const { plus, minus } = feature[featureName];
      return (
        <li key={`feature__${featureName}`}>
          <span className="feature--names-and-phones">
            <span className="feature--feature-name"> 
              {`[+ ${featureName}]`}
            </span>
            <span className="feature--feature-phones">
              {plus}
            </span>
          </span>
          <span className="feature--names-and-phones">
            <span className="feature--feature-name"> 
              {`[- ${featureName}]`}
            </span>
            <span className="feature--feature-phones">
              {minus}
            </span>
          </span>
        </li>
      )
    })
  }

  const featureMap = getFeatureMap(featureObject);
  const featureMapJSX = getFeatureMapJSX(featureMap);
  return featureMapJSX;
}

const parseNewPhones = somePhones => {
  if (somePhones === '') return [''];
  return somePhones.split('/').map(phone => phone.trim());
}

const handleClickDispatch = e => dispatchFunction => actionBuilder => actionParameters => {
  e.preventDefault();
  return dispatchFunction(actionBuilder(actionParameters));
}

const buildAddFeatureAction = ([newPositivePhones, newNegativePhones, feature]): featureAction => (
  {
    type: "ADD_FEATURE",
    value: {
      positivePhones: parseNewPhones(newPositivePhones),
      negativePhones: parseNewPhones(newNegativePhones),
      feature
    }
  }
)

const Features = ({ phones, features, dispatch }) => {
  const [feature, setFeature] = useState('aspirated')
  const [ newPositivePhones, setNewPositivePhones ] = useState('tʰ / pʰ / kʰ');
  const [ newNegativePhones, setNewNegativePhones ] = useState('t / p / k');
  
  const newFeaturesSubmit = e => {
    e.preventDefault();
    setFeature('');
    setNewPositivePhones('');
    setNewNegativePhones('');
  }

  return (
    <div className="Features" data-testid="Features">
      
      <h3>Phonetic Features</h3>
      
      <ul className="Features__list" data-testid="Features-list">
        {phones ? <>{parsePhonesFromFeatureObject(features)}</> : <></>}
      </ul>

      <form className="Features__form" data-testid="Features-form">
        <input 
          type="text" name="feature" 
          value={feature} onChange={e=> setFeature(e.target.value)}
          ></input>

        {/* ! Positive Phones */}
        <label htmlFor="positive-phones">+
          <input 
            id="positive-phones"
            type="text" name="phonemes" 
            value={newPositivePhones} onChange={e=> setNewPositivePhones(e.target.value)}
          ></input>
        </label>
        
        {/* ! Negative Phones */}
        <label htmlFor="negative-phones">-
          <input 
            id="negative-phones"
            type="text" name="phonemes" 
            value={newNegativePhones} onChange={e=> setNewNegativePhones(e.target.value)}
          ></input>
        </label>

        <input 
          type="submit" 
          onClick={e => handleClickDispatch(e)(dispatch)(buildAddFeatureAction)([newPositivePhones, newNegativePhones, feature])} 
          value="Add feature"
        ></input>
      </form>

    </div>
  );
}

export default Features;