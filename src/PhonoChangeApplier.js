import React, { useState } from 'react';
import './PhonoChangeApplier.scss';
import ls from 'local-storage';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';
import Options from './components/Options';
import Output from './components/Output';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['mun', 'tʰu', 'tɯm', 'utʰ']);
  const [ phonemes, setPhonemes ] = useState( 
      { 
        n: [ 'occlusive', 'sonorant', 'obstruent', 'nasal', 'alveolar' ], 
        m: [ 'occlusive', 'sonorant', 'obstruent', 'nasal', 'bilabial' ], 
        u: [ 'continuant', 'sonorant', 'syllabic', 'high', 'back', 'rounded' ], 
        ɯ: [ 'continuant', 'sonorant', 'syllabic', 'high', 'back', 'unrounded' ], 
        t: [ 'occlusive', 'plosive', 'obstruent', 'alveolar' ], 
        tʰ: [ 'occlusive', 'plosive', 'obstruent', 'alveolar', 'aspirated' ]
      } 
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
    
    // decompose Lexical Items
    // moving window on phonemes of each lexical item
    let lexicalFeatureBundles = []
    lexicon.forEach(lexeme => {
      let lexemeBundle = [];
      let startingIndex = 0;
      let lastIndex = lexeme.length - 1;
      [...lexeme].forEach((_, index) => {
        if (phonemes[lexeme.slice(startingIndex, index + 1)] && index !== lastIndex) return;
        if (phonemes[lexeme.slice(startingIndex, index + 1)]) return lexemeBundle.push(phonemes[lexeme.slice(startingIndex)])
        if (index !== 0 && index !== lastIndex) lexemeBundle.push(phonemes[lexeme.slice(startingIndex, index)])
        if (index === lastIndex) {
          lexemeBundle.push(phonemes[lexeme.slice(startingIndex, index)])
          lexemeBundle.push(phonemes[lexeme.slice(index)])
        }
        startingIndex = index;
      })
      lexicalFeatureBundles.push({[lexeme]: lexemeBundle});
    })
    console.log(lexicalFeatureBundles)
    // apply sound changes

    // handle output
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