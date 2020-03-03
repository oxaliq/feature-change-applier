import {stateReducer} from './reducer';

describe('Features', () => {
  const state = {}
  beforeEach(() => {
    state.phones = {
      a: {features: {occlusive: true}, grapheme: 'a'},
      n: {features: {occlusive: false}, grapheme: 'n'}
    };
    state.features = {
        occlusive: {
          positive: [state.phones.n],
          negative: [state.phones.a]
        }
    };
  });

  it('features returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('feature addition returns new feature list', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'anterior'}};
    expect(stateReducer(state, action)).toEqual(
      {...state, 
        features:{...state.features, 
          anterior:{ positive:[], negative:[] }
        }
      }
    );
  });

  it('feature deletion returns new feature list', () => {
    const action = {type: 'DELETE_FEATURE', value: 'occlusive'}
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features: {},
        phones: {
          a: {features: {}, grapheme: 'a'},
          n: {features: {}, grapheme: 'n'}
        }
      }
    )
  })

});