import {stateReducer} from './stateReducer';

describe('Epochs', () => {
  const state = {};
  beforeEach(()=> {
    state.epochs = [
      {
        name: 'epoch 1',
        changes: ['']
      }
    ]
  })

  it('epochs returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('epochs addition returns new epochs list', () => {
    const action = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: ['']}};
    expect(stateReducer(state, action)).toEqual({...state, epochs: [...state.epochs, action.value]})
  })
  
  it('epoch name mutation returns new epochs list with mutation', () => {
    const firstAction = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: ['']}};
    const secondAction = {type: 'SET_EPOCH', value: { index: 0, name: 'proto-lang'}};
    const secondState = stateReducer(state, firstAction);
    expect(stateReducer(secondState, secondAction)).toEqual(
      {...state, 
        epochs: [
          {name: 'proto-lang', changes: ['']},
          {name: 'epoch 2', changes: ['']}
        ]
      }
    );
  });
  
  it('epoch changes mutation returns new epochs list with mutation', () => {
    const firstAction = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: ['']}};
    const secondAction = {type: 'SET_EPOCH', value: { index: 0, changes: ['n>t/_#', '[+plosive]>[+nasal -plosive]/_n']}};
    const secondState = stateReducer(state, firstAction);
    expect(stateReducer(secondState, secondAction)).toEqual(
      {...state, 
        epochs: [
          {name: 'epoch 1', changes: ['n>t/_#', '[+plosive]>[+nasal -plosive]/_n']},
          {name: 'epoch 2', changes: ['']}
        ]
      }
    );
  });

});