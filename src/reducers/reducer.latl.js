

export const setLatl = (state, action) => {
  let latl = action.value;
  return {...state, latl};
}

export const parseLatl = (state, action) => {
  let latl = state.action;
  return { ...state }
}