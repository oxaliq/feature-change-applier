import {stateReducer} from './stateReducer';

describe('Features', () => {
  const state = {
    features: [
      'low', 'high','back', 'rounded', 'sonorant', 
      'nasal', 'obstruent', 'occlusive', 'plosive', 
      'prenasalized', 'aspirated', 'coronal'
    ]
  };
  
  it('features returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('feature addition returns new feature list', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'anterior'}};
    expect(stateReducer(state, action)).toEqual({...state, features:[...state.features, action.value.feature]})
  })

});