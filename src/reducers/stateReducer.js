const initState = () => {
  return {

  }
}

const addPhones = (phones, phone) => {
  let node = {}
  phone.split('').forEach((graph, index) => {
    if (index) node[graph] = {}
    if (!index && !phones[graph]) phones[graph] = {} 
    node = index === 0 ? phones[graph] : node[graph];
  })
  return phones;
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
      let newFeature = action.value.feature;
      let positivePhones = action.value.positivePhones || [];
      let negativePhones = action.value.negativePhones || [];
      
      let newPhoneObject = [
        ...positivePhones, ...negativePhones
      ].reduce((phoneObject, phone) => addPhones(phoneObject, phone), state.phones)
      if (positivePhones) positivePhones = positivePhones.reduce(
        (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeature, true)
        , newPhoneObject);
      if (negativePhones) negativePhones = negativePhones.reduce(
        (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeature, false)
        , newPhoneObject);
      return {...state, features:[...state.features, newFeature], phones: newPhoneObject}
    }

    default:
      return state;
  }
}

module.exports = {initState, stateReducer}