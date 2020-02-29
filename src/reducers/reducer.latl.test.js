import { stateReducer } from './reducer';
import { initState } from './reducer.init';

describe('LATL', () => {
  it('returns state unaltered with no action body', () => {
    const state = initState();
    const action = {
      type: 'SET_LATL',
      value: {}
    }
    const returnedState = stateReducer(state, action)
    expect(returnedState).toStrictEqual(state);
  })
})