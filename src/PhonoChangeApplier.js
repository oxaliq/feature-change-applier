import React, { useState, useReducer } from 'react';
import { Link, Route } from 'react-router-dom';

import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';
import Options from './components/Options';
import Output from './components/Output';

import Latl from './components/Latl';
import LatlOutput from './components/LatlOutput';

import { stateReducer } from './reducers/reducer';
import { clearState } from './reducers/reducer.init';

const PhonoChangeApplier = () => {
  const [ state, dispatch ] = useReducer(
    stateReducer,
    {},
    clearState
  )
  const { lexicon, phones, phonemes, epochs, options, features, results, errors, latl, parseResults } = state;

  return (
    <>

      <Route exact path="/latl">
        <Link to="/">Back to GUI</Link>
        <div className="PhonoChangeApplier PhonoChangeApplier--latl">
          <Latl latl={latl} dispatch={dispatch}/>
          <LatlOutput results={results} options={options} parseResults={parseResults} errors={errors} dispatch={dispatch}/>
        </div>
      </Route>

      <Route exact path="/">
        <Link to="/latl">LATL</Link>
        <div className="PhonoChangeApplier PhonoChangeApplier--gui" data-testid="PhonoChangeApplier">
          <ProtoLang lexicon={lexicon} dispatch={dispatch}/>
          <Features phones={phones} features={features} dispatch={dispatch}/>
          <Epochs epochs={epochs} errors={errors} dispatch={dispatch} />
          <Options options={options} dispatch={dispatch}/>
          <Output results={results} options={options} dispatch={dispatch}/>
        </div>
      </Route>

    </>
  );
}

export default PhonoChangeApplier;