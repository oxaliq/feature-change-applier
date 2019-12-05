import {stateReducer} from './stateReducer';

describe('Epochs', () => {
  const state = {};
  beforeEach(()=> {
    state.epochs = [
      {
        name: 'epoch 1',
        changes: []
      }
    ]
  })

  it('epochs returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('epochs addition returns new epochs list', () => {
    const action = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: []}};
    expect(stateReducer(state, action)).toEqual({...state, epochs: [...state.epochs, action.value]})
  })
});