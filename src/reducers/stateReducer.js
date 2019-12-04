const initState = () => {
  return {

  }
}

const stateReducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return initState();
    }
  
    default:
      return state;
  }
}

module.exports = {initState, stateReducer}