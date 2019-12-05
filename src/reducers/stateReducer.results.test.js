import {stateReducer, initState} from './stateReducer';

describe('Results', () => {
  let state = {};
  beforeEach(()=> {
    state = initState();
  })

  it('results returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('results returned from test cases', () => {
    
  })

});