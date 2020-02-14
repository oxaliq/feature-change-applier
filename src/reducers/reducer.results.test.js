import { stateReducer } from './reducer';
import { initState } from './reducer.init';
import { decomposeRules } from './reducer.results';

describe('Results', () => {
  let state = {};
  beforeEach(()=> {
    state = {};
  })

  it('results returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('rules decomposed properly', () => {
    const epoch = initState().epochs[0];
    epoch.changes = epoch.changes.slice(0,1)
    const phones = initState().phones;
    const result = [
      {
        // ! '[+ occlusive - nasal]>[+ occlusive nasal]/n_',
        environment: {
          pre: [
            {
              sonorant: true, nasal: true, occlusive: true, coronal: true
            }
          ],
          position: [
            {occlusive: true, nasal: false}
          ],
          post: [],
        },
        newFeatures: {occlusive: true, nasal: true}
      }
    ];
    expect(decomposeRules(epoch, phones)).toBe(result);
  })

  // it('results returned from first sound change rule', () => {
  //   const action = {type: 'RUN'};
  //   state = initState(0)
  //   expect(stateReducer(state, action).results).toEqual({
  //     pass: 'epoch 1',
  //     results: [
  //       'anna', 'anat', 'anət', 'anna', 'tan', 'ənna'
  //     ]
  //   })
  // });

});