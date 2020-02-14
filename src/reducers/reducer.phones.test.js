import {stateReducer} from './reducer';

describe('Phones', () => {
  const n_phone = {features: {nasal: true}, grapheme: 'n'};
  const state = {};
  beforeEach(()=> {
    state.phones= { n: n_phone };
    state.features = {
      nasal: {
        positive: [state.phones.n],
        negative: []
      }
    };
  })

  it('phones returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('feature addition returns new feature list with positive phones updated', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'anterior', positivePhones: ['n']}};
    expect(stateReducer(state, action)).toEqual(
      {...state, 
        features:{...state.features, anterior: { positive: [state.phones.n], negative: [] }},
        phones:{...state.phones, n:{...state.phones.n, features: {...state.phones.n.features, anterior: true}}}
      }
      )
  })

  it('feature addition returns new feature list with negative phones update', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'sonorant', negativePhones: ['t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:{...state.features, sonorant: { positive: [], negative: [state.phones.t] }},
        phones:{...state.phones, t:{features:{sonorant: false}, grapheme: 't'}}
      }
    );
  });
  
  it('feature addition returns new feature list with positive and negative phones update', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'sonorant', positivePhones: ['n'], negativePhones: ['t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:{...state.features, sonorant: { positive: [state.phones.n], negative: [state.phones.t] }},
        phones:{...state.phones, 
          t:{features:{sonorant: false}, grapheme: 't'},
          n:{...state.phones.n, features: {...state.phones.n.features, sonorant: true}}
        }
      }
    );
  });
  
  it('feature addition returns new feature list with multi-graph phones updated', () => {
    const action = {type: 'ADD_FEATURE', value: {feature: 'aspirated', positivePhones: ['ntʰ'], negativePhones: ['n','t']}};
    expect(stateReducer(state, action)).toEqual(
      {...state,
        features:{...state.features, 
          aspirated: {
            positive: [state.phones.n.t.ʰ], 
            negative: [state.phones.n, state.phones.t]
          } 
        },
        phones:{...state.phones, 
          t:{features:{aspirated: false}, grapheme: 't'},
          n:{...state.phones.n, features: {...state.phones.n.features, aspirated: false},
            t: {ʰ:{features:{aspirated:true}, grapheme: 'ntʰ'}}
          }
        }
      }
    );    
  });
});