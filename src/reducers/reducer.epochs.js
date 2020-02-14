// @flow
import type { stateType } from './reducer';

export type epochAction = {
  type: "ADD_EPOCH" | "SET_EPOCH" | "REMOVE_EPOCH",
  value: {
    index?: number,
    name: string,
    changes?: Array<string>
  }
}

export const addEpoch = (state: stateType, action: epochAction): stateType => {
  const newEpoch = { name: action.value.name, changes: action.value.changes || [''] };
  return {...state, epochs: [...state.epochs, newEpoch]}
}

export const setEpoch = (state: stateType, action: epochAction): stateType => {
  const index = action.value.index;
  if (typeof index !== 'number') return state;
  
  const mutatedEpochs = state.epochs;
  mutatedEpochs[index].name = action.value.name 
    ? action.value.name 
    : mutatedEpochs[index].name;

  mutatedEpochs[index].changes = action.value.changes 
    ? action.value.changes 
    : mutatedEpochs[index].changes;
  return {...state, epochs: [...mutatedEpochs]}
}

export const removeEpoch = (state: stateType, action: epochAction): stateType => {
  const mutatedEpochs = state.epochs.filter(epoch => epoch.name !== action.value.name )
  return {...state, epochs: [...mutatedEpochs]}
}