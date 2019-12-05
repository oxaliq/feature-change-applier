const initState = () => {
  return {

  }
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
      return {...state, features:[...state.features, newFeature]}
    }

    default:
      return state;
  }
}

module.exports = {initState, stateReducer}