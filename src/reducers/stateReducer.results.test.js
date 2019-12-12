import {stateReducer} from './stateReducer';
import {initState} from './stateReducer.init';

describe('Results', () => {
  let state = {};
  beforeEach(()=> {
    state = {};
  })

  it('results returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('results returned from first sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(0)
    expect(stateReducer(state, action).results).toEqual({
      pass: 'epoch 1',
      results: [
        'anna', 'anat', 'anət', 'anna', 'tan', 'ənna'
      ]
    })
  });

});