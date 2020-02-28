// @flow
import { addLexeme, setLexicon } from './reducer.lexicon';
import type { lexiconAction } from './reducer.lexicon';
import { addEpoch, setEpoch, removeEpoch } from './reducer.epochs';
import type { epochAction } from './reducer.epochs';
import { addFeature, deleteFeature } from './reducer.features';
import type { featureAction } from './reducer.features';
import type { optionsAction } from './reducer.options';
import { setOptions } from './reducer.options';
import { run } from './reducer.results';
import type { resultsAction } from './reducer.results'
import { initState } from './reducer.init';
import type { initAction } from './reducer.init';
import { clearOutput } from './reducer.clear';

export type stateType = {
  lexicon: Array<{lexeme: string, epoch: epochType}>,
  epochs: Array<epochType>,
  phones: {[key: string]: phoneType},
  options: {output: string, save: boolean},
  results: [],
  errors: {},
  features: featureType
}

type epochType = {
  name: string, changes: Array<string>
}

type phoneType = {
  grapheme: string,
  features: {[key: string]: boolean}
}

type featureType = {
  [key: string]: {[key: string]: Array<phoneType>}
}

type actionType = featureAction | epochAction | initAction | resultsAction | lexiconAction

export const stateReducer = (state: stateType, action: actionType): stateType => {
  switch (action.type) {
    case 'INIT': {
      return initState();
    }
    
    case 'ADD_LEXEME': return addLexeme(state, action);
    
    case 'SET_LEXICON': return setLexicon(state, action);

    case 'ADD_EPOCH': return addEpoch(state, action);

    case 'SET_EPOCH': return setEpoch(state, action);

    case 'REMOVE_EPOCH': return removeEpoch(state, action);

    case 'ADD_FEATURE': return addFeature(state, action);

    case 'DELETE_FEATURE': return deleteFeature(state, action);

    case 'SET_OPTIONS': return setOptions(state, action);

    case 'CLEAR': return clearOutput(state, action);

    case 'RUN': return run(state, action);

    default: return state;
  }
}
