import React, { useState, useReducer } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';
import Options from './components/Options';
import Output from './components/Output';

import { stateReducer } from './reducers/reducer';
import { initState } from './reducers/reducer.init';

const PhonoChangeApplier = () => {
  const [ state, dispatch ] = useReducer(
    stateReducer,
    {},
    initState
  )
  const { lexicon, phones, phonemes, epochs, options, features, results, errors } = state;

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} dispatch={dispatch}/>
      <Features phones={phones} features={features} dispatch={dispatch}/>
      <Epochs epochs={epochs} errors={errors} dispatch={dispatch} />
      <Options options={options} dispatch={dispatch}/>
      <Output results={results} options={options} dispatch={dispatch}/>
    </div>
  );
}

export default PhonoChangeApplier;