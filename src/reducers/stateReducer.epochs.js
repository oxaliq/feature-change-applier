// @flow
import type { stateType } from './stateReducer';

export type epochAction = {
  type: "ADD_EPOCH" | "SET_EPOCH",
  value: {
    index?: number,
    name: string,
    changes?: Array<string>
  }
}

export const addEpoch = (state: stateType, action: epochAction): stateType => {
  const newEpoch = { ...action.value, changes: ['']};
  return {...state, epochs: [...state.epochs, newEpoch]}
}

export const setEpoch = (state: stateType, action: epochAction): stateType => {
  let mutatedEpochs = state.epochs;
  const index = action.value.index
  if (!index) return state;
  mutatedEpochs[index].name = action.value.name 
    ? action.value.name 
    : mutatedEpochs[index].name;

  mutatedEpochs[index].changes = action.value.changes 
    ? action.value.changes 
    : mutatedEpochs[index].changes;
  return {...state, epochs: [...mutatedEpochs]}
}