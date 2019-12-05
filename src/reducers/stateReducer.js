const initState = () => {
  return {

  }
}

const addPhones = (phones, phone) => {
  let node = {};
  phone.split('').forEach((graph, index) => {
    if (index) node[graph] = {}
    if (!index && !phones[graph]) phones[graph] = {} 
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.length - 1) node.grapheme = phone;
  })
  return phones;
}

const findPhone = (phones, phone) => {
  let node;
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
  });
  return node;
}

const addFeatureToPhone = (phones, phone, featureKey, featureValue) => {
  let node = {}
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.split('').length - 1) node.features = {...node.features, [featureKey]: featureValue}
  })
  return phones;
}

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return initState();
    }
    
    case 'ADD_LEXEME': {
      let newLexeme = action.value;
      if (!newLexeme.epoch) newLexeme.epoch = state.epochs[0].name;
      return {...state, lexicon:[...state.lexicon, newLexeme]}
    }
    
    case 'SET_LEXICON': {
      let newLexicon = action.value;
      newLexicon = newLexicon.map(lexeme => lexeme.epoch 
        ? lexeme 
        : {...lexeme, epoch: state.epochs[0].name});
      return {...state, lexicon: newLexicon}
    }

    case 'ADD_FEATURE': {
      let positivePhones = action.value.positivePhones || [];
      let negativePhones = action.value.negativePhones || [];
      let newFeatureName = action.value.feature;
      
      let newPhoneObject = [
        ...positivePhones, ...negativePhones
      ].reduce((phoneObject, phone) => addPhones(phoneObject, phone), state.phones)
      
      if (positivePhones) {

        positivePhones.reduce(
          (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, true)
          , newPhoneObject
        );

        positivePhones = positivePhones.map( positivePhone => findPhone(newPhoneObject, positivePhone) )
        // console.log(positivePhones)
      }
      
      if (negativePhones) {
        
        negativePhones.reduce(
          (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, false)
          , newPhoneObject
          );
          
        negativePhones = negativePhones.map( negativePhone => findPhone(newPhoneObject, negativePhone) )
        // console.log(negativePhones)
      }
      
      let newFeature = {[action.value.feature]: {positive: positivePhones, negative: negativePhones}};
      return {...state, features:{...state.features, ...newFeature}, phones: newPhoneObject}
    }

    default:
      return state;
  }
}

module.exports = {initState, stateReducer}