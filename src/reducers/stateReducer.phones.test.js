import {stateReducer} from './stateReducer';

describe('Phones', () => {
  const n_phone = {features: {nasal: true}}
  const state = {
    features: [
      'nasal'
    ],
    phones: { n: n_phone }
  };

  beforeEach(()=> {
    state.features = [ 'nasal' ];
    state.phones= { n: n_phone };
  })

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

  it('feature addition returns new feature list with negative phones update', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'sonorant', negativePhones: ['t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:[...state.features, action.value.feature],
        phones:{...state.phones, t:{features:{sonorant: false}}}
      }
    );
  });
  
  it('feature addition returns new feature list with positive and negative phones update', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'sonorant', positivePhones: ['n'], negativePhones: ['t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:[...state.features, action.value.feature],
        phones:{...state.phones, 
          t:{features:{sonorant: false}},
          n:{...state.phones.n, features: {...state.phones.n.features, sonorant: true}}
        }
      }
    );
  });
  
  it('feature addition returns new feature list with multi-graph phones updated', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'aspirated', positivePhones: ['ntʰ'], negativePhones: ['n','t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:[...state.features, action.value.feature],
        phones:{...state.phones, 
          t:{features:{aspirated: false}},
          n:{...state.phones.n, features: {...state.phones.n.features, aspirated: false},
            t: {ʰ:{features:{aspirated:true}}}
          }
        }
      }
    );    
  });
});