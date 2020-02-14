// @flow
import type { stateType } from './reducer';

export type featureAction = {
  type: "ADD_FEATURE",
  value: {
    positivePhones: Array<string>,
    negativePhones: Array<string>,
    feature: string
  }
}

const addPhones = (phones: {}, phone: string): {} => {
  let node = {};

  phone.split('').forEach((graph, index) => {
    if (index) node[graph] = {}
    if (!index && !phones[graph]) phones[graph] = {} 
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.length - 1) node.grapheme = phone;
  })

  return phones;
}

const findPhone = (phones: {}, phone: string): {} => {
  return phone
    .split('')
    .reduce((node, graph, index) => {
      node = index === 0 ? phones[graph] : node[graph];
      return node;
    }, {});
}

const addFeatureToPhone = (
  phones: {}, phone: string, featureKey: string, featureValue: boolean
): {} => {
  let node = {}
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
    
    if (index === phone.split('').length - 1) {
      node.features = {...node.features, [featureKey]: featureValue}
    }
  });
  return phones;
}

export const addFeature = (state: stateType, action: featureAction): stateType => {
  let positivePhones = action.value.positivePhones || [];
  let negativePhones = action.value.negativePhones || [];
  let newFeatureName = action.value.feature;
  let newPhoneObject = [
    ...positivePhones, ...negativePhones
  ]
  .reduce((phoneObject, phone) => addPhones(phoneObject, phone), state.phones)
  
  if (positivePhones) {

    positivePhones.reduce(
      (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, true)
      , newPhoneObject
    );

    positivePhones = positivePhones.map( positivePhone => findPhone(newPhoneObject, positivePhone) )
  }
      
  if (negativePhones) {
    
    negativePhones.reduce(
      (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, false)
      , newPhoneObject
      );
      
    negativePhones = negativePhones.map( negativePhone => findPhone(newPhoneObject, negativePhone) )
  }
  
  let newFeature = {[action.value.feature]: {positive: positivePhones, negative: negativePhones}};
  return {...state, features:{...state.features, ...newFeature}, phones: newPhoneObject}
}