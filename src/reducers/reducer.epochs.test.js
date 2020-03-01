import {stateReducer} from './reducer';

describe('Epochs', () => {
  const state = {};
  beforeEach(()=> {
    state.epochs = [
      {
        name: 'epoch 1',
        changes: [''],
        parent: null
      }
    ]
  })

  it('epochs returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('epochs addition returns new epochs list', () => {
    const action = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: [''], parent: null}};
    expect(stateReducer(state, action)).toEqual({...state, epochs: [...state.epochs, action.value]})
  })
  
  it('epoch name mutation returns new epochs list with mutation', () => {
    const firstAction = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: ['']}};
    const secondAction = {type: 'SET_EPOCH', value: { index: 0, name: 'proto-lang'}};
    const secondState = stateReducer(state, firstAction);
    expect(stateReducer(secondState, secondAction)).toEqual(
      {...state, 
        epochs: [
          {name: 'proto-lang', changes: [''], parent: null},
          {name: 'epoch 2', changes: [''], parent: null}
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
          {name: 'epoch 1', changes: ['n>t/_#', '[+plosive]>[+nasal -plosive]/_n'], parent: null},
          {name: 'epoch 2', changes: [''], parent: null}
        ]
      }
      );
    });
    
    it('epochs returned with deleted epoch removed', () => {
      const firstAction = {type: 'ADD_EPOCH', value: { name: 'epoch 2', changes: ['']}};
      const stateWithTwoEpochs = stateReducer(state, firstAction);
      const secondAction = {type: 'REMOVE_EPOCH', value: {index: 0, name: 'epoch 1'}}
      expect(stateReducer(stateWithTwoEpochs, secondAction)).toEqual({
        ...state,
        epochs: [{ name: 'epoch 2', changes: [''], parent: null}]
      });
  });

});