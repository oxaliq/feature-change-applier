import { stateReducer } from './stateReducer';
import { initState } from './stateReducer.init';

describe('Options', () => {
  let state = {}
  beforeEach(() => {
    state = initState();
  });

  it('Options returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  // output: 'default', save: false
  it('Options change to output returns with changed value', () => {
    const action = {type: 'SET_OPTIONS', value: {option: 'output', setValue: 'proto'}};
    expect(stateReducer(state, action)).toEqual(
      {...state, 
        options: {...state.options, 
          output: 'proto'
        }
      }
    );
  });
  
  it('Options change to save returns with changed value', () => {
    const action = {type: 'SET_OPTIONS', value: {option: 'save', setValue: 'true'}};
    expect(stateReducer(state, action)).toEqual(
      {...state, 
        options: {...state.options, 
          save: true
        }
      }
    );
  });

});