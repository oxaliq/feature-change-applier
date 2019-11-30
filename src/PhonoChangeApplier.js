import React, { useState } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';
import Options from './components/Options';
import Output from './components/Output';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['one']);
  const [ phonemes, setPhonemes ] = useState( 
      { phoneme: [ 'feature' ] } 
  );
  const [ epochs, setEpochs ] = useState([{name: 'epoch 1', changes:['[+ feature]>[- feature]/_#']}]);
  const [ options, setOptions ] = useState({output: 'default', save: false})
  const [ results, setResults ] = useState([])
  const [ errors, setErrors ] = useState({})
  
  const runChanges = e => {
    e.preventDefault();

    let ruleError = epochs.reduce((errorObject, epoch) => {
      epoch.changes.map((change, index) => {
        if (!change.match(/>.*\/.*_/)) errorObject[epoch.name] 
          ? errorObject[epoch.name].push(index) 
          : errorObject[epoch.name] = [index]
      })
      return errorObject;
    }, {})
    
    if (Object.entries(ruleError).length) return setErrors(ruleError)
    setErrors({});
    
    // setResults
  }

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features phonemes={phonemes} setPhonemes={setPhonemes}/>
      <Epochs epochs={epochs} setEpochs={setEpochs} errors={errors}/>
      <Options options={options} setOptions={setOptions} runChanges={runChanges}/>
      <Output results={results} setResults={setResults}/>
    </div>
  );
}

export default PhonoChangeApplier;