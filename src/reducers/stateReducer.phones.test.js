import {stateReducer} from './stateReducer';

describe('Phones', () => {
  const n_phone = {features: {nasal: true}}
  const state = {
    features: [
      'nasal'
    ],
    phones: { n: n_phone }
  };

  
  it('phones returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('feature addition returns new feature list with positive phones updated', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'anterior', positivePhones: ['n']}};
    expect(stateReducer(state, action)).toEqual(
      {...state, 
        features:[...state.features, action.value.feature],
        phones:{...state.phones, n:{...state.phones.n, features: {...state.phones.n.features, anterior: true}}}
      }
      )
  })

});