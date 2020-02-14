// @flow
import type { stateType } from './reducer';

type lexemeType = {
  lexeme: string,
  epoch?: string
}

type addLexemeAction = {
  type: 'ADD_LEXEME',
  value: lexemeType
}

type setLexiconAction = {
  type: 'SET_LEXICON',
  value: Array<lexemeType>
}

const makeLexeme = (lexeme: string, epochName: ?string, state: stateType) => {
  const newLexeme = {lexeme: lexeme, epoch: state.epochs[0]};
  if (epochName) {
    const epochIndex = state.epochs.findIndex(epoch => epoch.name === epochName);
    if (epochIndex > 0) {
      newLexeme.epoch = state.epochs[epochIndex];
    };
  }
  return newLexeme;
}

export type lexiconAction = addLexemeAction | setLexiconAction

export const addLexeme = (state: stateType, action: addLexemeAction): stateType => {
  const newLexeme = makeLexeme(action.value.lexeme, action.value.epoch, state);
  return {...state, lexicon:[...state.lexicon, newLexeme]}
}

export const setLexicon = (state: stateType, action: setLexiconAction): stateType => {
  let newLexicon = action.value;
  newLexicon = newLexicon.map(lexeme => makeLexeme(lexeme.lexeme, lexeme.epoch, state));
  return {...state, lexicon: newLexicon}
}