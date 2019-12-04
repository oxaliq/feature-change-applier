import {stateReducer} from './stateReducer';

describe('Features', () => {
  const state = {
    features: [
      'low', 'high','back', 'rounded', 'sonorant', 
      'nasal', 'obstruent', 'occlusive', 'plosive', 
      'prenasalized', 'aspirated', 'coronal', 'anterior'
    ]
  };
  
  it('features returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

});