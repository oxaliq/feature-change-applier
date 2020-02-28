export const clearOutput = (state, action) => {
  return { ...state, results: [], errors: {} };
}