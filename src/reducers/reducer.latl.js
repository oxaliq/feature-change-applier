

export const setLatl = (state, action) => {
  let latl = action.value;
  return {...state, latl};
}