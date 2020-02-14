import {stateReducer} from './reducer';

describe('Lexicon', () => {
  const state = {
    epochs: [
      { name: 'epoch 1', changes:[''] }, 
      { name: 'epoch 2', changes:[''] }
    ]
  }
  state.lexicon = [
    {lexeme:'anta', epoch:state.epochs[0]},
    {lexeme:'anat', epoch:state.epochs[0]},
    {lexeme:'anət', epoch:state.epochs[0]},
    {lexeme:'anna', epoch:state.epochs[0]},
    {lexeme:'tan', epoch:state.epochs[0]}, 
    {lexeme:'ənta', epoch:state.epochs[0]}
  ]
  ;
  
  it('lexicon returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('lexicon addition without epoch returns updated lexicon with default epoch', () => {
    const action = {type: 'ADD_LEXEME', value: {lexeme:'ntʰa'}}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:[...state.lexicon, {lexeme:'ntʰa', epoch:state.epochs[0]}]});
  });
  
  it('lexicon addition with epoch returns updated lexicon with correct epoch', () => {
    const action = {type: 'ADD_LEXEME', value: {lexeme:'ntʰa', epoch: 'epoch 2'}}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:[...state.lexicon, {lexeme:'ntʰa', epoch:state.epochs[1]}]});  
  });

  it('lexicon set returns updated lexicon with correct epoch', () => {
    const newLexicon = [
      {lexeme:'anta', epoch:'epoch 1'},
      {lexeme:'anat', epoch:'epoch 1'},
      {lexeme:'anət', epoch:'epoch 1'},
      {lexeme:'anna', epoch:'epoch 1'}
    ]
    const action = {type: 'SET_LEXICON', value: newLexicon}
    expect(stateReducer(state, action)).toEqual({...state, lexicon:[
      {lexeme:'anta', epoch:state.epochs[0]},
      {lexeme:'anat', epoch:state.epochs[0]},
      {lexeme:'anət', epoch:state.epochs[0]},
      {lexeme:'anna', epoch:state.epochs[0]}
    ]});
  });
  
  it('lexicon set with no epoch returns updated lexicon with defaul epoch', () => {
    const newLexicon = [
      {lexeme:'anta', epoch:state.epochs[0]},
      {lexeme:'anat', epoch:state.epochs[0]},
      {lexeme:'anət', epoch:state.epochs[1]},
      {lexeme:'anna', epoch:state.epochs[0]}
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