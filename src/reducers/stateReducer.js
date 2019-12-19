// @flow
import { addLexeme, setLexicon } from './stateReducer.lexicon';
import type { lexiconAction } from './stateReducer.lexicon';
import { addEpoch, setEpoch, removeEpoch } from './stateReducer.epochs';
import type { epochAction } from './stateReducer.epochs';
import { addFeature } from './stateReducer.features';
import type { featureAction } from './stateReducer.features';
import { run } from './stateReducer.results';
import type { resultsAction } from './stateReducer.results'
import { initState } from './stateReducer.init';
import type { initAction } from './stateReducer.init';

export type stateType = {
  lexicon: Array<{lexeme: string, epoch: epochType}>,
  epochs: Array<epochType>,
  phones: {[key: string]: phoneType},
  options: {output: string, save: boolean},
  results: {},
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

    case 'RUN': return run(state, action);

    default: return state;
  }
}
