// @flow
import type { stateType } from './reducer';

export type optionAction = {
  type: 'SET_OPTIONS',
  value: {
    option: string,
    setValue: string
  }
};

export const setOptions = (state: stateType, action: optionAction): stateType => {
  const option = action.value.option;
  let value = action.value.setValue;
  if (value === 'true') value = true;
  if (value === 'false') value = false;
  const mutatedState = {...state};
  mutatedState.options[option] = value;
  return mutatedState;
}