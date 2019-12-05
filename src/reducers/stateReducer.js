const initState = () => {
  return {

  }
}

const addPhones = (phones, phone) => {
  phone.split('').forEach((graph, index) => {
    if (!phones[graph]) phones[graph] = {}
  })
  return phones;
}

const addPositiveFeature = (phones, positivePhone, feature) => {
  let node = {}
  positivePhone.split('').forEach((graph, index) => {
    node = index === 0 ? node = phones[graph] : node = node[graph];
    if (index === positivePhone.split('').length - 1) node.features = {...node.features, [feature]: true}
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
        (phoneObject, positivePhone) => addPositiveFeature(phoneObject, positivePhone, newFeature)
        , newPhoneObject);

      return {...state, features:[...state.features, newFeature], phones: newPhoneObject}
    }

    default:
      return state;
  }
}

module.exports = {initState, stateReducer}