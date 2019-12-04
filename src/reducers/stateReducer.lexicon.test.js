import {stateReducer} from './stateReducer';

describe('Lexicon', () => {
  const state = {
    lexicon: [
      {lexeme:'anta', epoch:'epoch 1'},
      {lexeme:'anat', epoch:'epoch 1'},
      {lexeme:'anət', epoch:'epoch 1'},
      {lexeme:'anna', epoch:'epoch 1'},
      {lexeme:'tan', epoch:'epoch 1'}, 
      {lexeme:'ənta', epoch:'epoch 1'}
    ],
    epochs: [{name: 'epoch 1'}]
  };
  
  it('lexicon returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('lexicon addition without epoch returns updated lexicon with default epoch', () => {
    const action = {type: 'ADD_LEXEME', value: {lexeme:'ntʰa'}}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:[...state.lexicon, {lexeme:'ntʰa', epoch:'epoch 1'}]});
  });
  
  it('lexicon addition with epoch returns updated lexicon with correct epoch', () => {
    const action = {type: 'ADD_LEXEME', value: {lexeme:'ntʰa', epoch: 'epoch 2'}}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:[...state.lexicon, action.value]});  
  });

  it('lexicon set returns updated lexicon with correct epoch', () => {
    const newLexicon = [
      {lexeme:'anta', epoch:'epoch 1'},
      {lexeme:'anat', epoch:'epoch 1'},
      {lexeme:'anət', epoch:'epoch 1'},
      {lexeme:'anna', epoch:'epoch 1'}
    ]
    const action = {type: 'SET_LEXICON', value: newLexicon}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:newLexicon});
  });
  
  it('lexicon set with no epoch returns updated lexicon with defaul epoch', () => {
    const newLexicon = [
      {lexeme:'anta', epoch:'epoch 1'},
      {lexeme:'anat', epoch:'epoch 1'},
      {lexeme:'anət', epoch:'epoch 2'},
      {lexeme:'anna', epoch:'epoch 1'}
    ]
    const inputLexicon = [
      {lexeme:'anta'},
      {lexeme:'anat'},
      {lexeme:'anət', epoch:'epoch 2'},
      {lexeme:'anna'}
    ]
    const action = {type: 'SET_LEXICON', value: inputLexicon}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:newLexicon});
  })
});