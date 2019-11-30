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
  
  const runChanges = e => {
    e.preventDefault();
    console.log('running...')
  }

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features phonemes={phonemes} setPhonemes={setPhonemes}/>
      <Epochs epochs={epochs} setEpochs={setEpochs}/>
      <Options options={options} setOptions={setOptions} runChanges={runChanges}/>
      <Output results={results} setResults={setResults}/>
    </div>
  );
}

export default PhonoChangeApplier;