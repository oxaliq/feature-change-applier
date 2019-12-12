import React, { useState, useReducer } from 'react';
import './PhonoChangeApplier.scss';

// import ls from 'local-storage';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';
import Options from './components/Options';
import Output from './components/Output';

import {stateReducer} from './reducers/stateReducer';
import {initState} from './reducers/stateReducer.init';

const PhonoChangeApplier = () => {
  const [ state, dispatch ] = useReducer(
    stateReducer,
    {},
    initState
  )

  const [ lexicon, setLexicon ] = useState(['mun', 'tʰu', 'tɯm', 'utʰ']);
  const [ phonemes, setPhonemes ] = useState( 
    // ! candidate for trie to avoid situations where >2 graph phonemes 
    // ! are uncaught by lexeme decomposition when <n graph phonemes are not present
    { 
      n: [ 'occlusive', 'sonorant', 'obstruent', 'nasal', 'alveolar' ], 
      m: [ 'occlusive', 'sonorant', 'obstruent', 'nasal', 'bilabial' ], 
      u: [ 'continuant', 'sonorant', 'syllabic', 'high', 'back', 'rounded' ], 
      ɯ: [ 'continuant', 'sonorant', 'syllabic', 'high', 'back', 'unrounded' ], 
      t: [ 'occlusive', 'plosive', 'obstruent', 'alveolar' ], 
      tʰ: [ 'occlusive', 'plosive', 'obstruent', 'alveolar', 'aspirated' ],
    } 
  );
  const [ epochs, setEpochs ] = useState([{name: 'epoch 1', changes:['[+ rounded]>[- rounded + unrounded]/_#']}]);
  const [ options, setOptions ] = useState({output: 'default', save: false})
  const [ results, setResults ] = useState([])
  const [ errors, setErrors ] = useState({})
  const [ features, setFeatures ] = useState(
    ['occlusive', 'sonorant', 'obstruent', 'nasal', 'alveolar','bilabial',
    'continuant','syllabic','high','back','rounded','unrounded', 'plosive','aspirated'])

  const runChanges = e => {
    e.preventDefault();

    let ruleError = epochs.reduce((errorObject, epoch) => {
      epoch.changes.map((change, index) => {
        if (!change.match(/>.*\/.*_/)) {
          errorObject[epoch.name] 
            ? errorObject[epoch.name].push(index) 
            : errorObject[epoch.name] = [index]
          errorObject[epoch.name].ruleSyntaxError = true;
        }
        
        // TODO validate phoneme syntax
        let decomposedChange = change.split('>');
        decomposedChange = [decomposedChange[0], ...decomposedChange[1].split('/')]
        decomposedChange = [decomposedChange[0], decomposedChange[1], ...decomposedChange[2].split('_')];
      
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
      lexemeBundle.unshift(['#'])
      lexemeBundle.push(['#'])
      lexicalFeatureBundles.push(lexemeBundle);
    })
    console.log(lexicalFeatureBundles)
    
    // decompose rules
    let allEpochs = epochs.map(epoch => {
      let ruleBundle = epoch.changes.map(rule => {
        return {
          input: rule.split('>')[0].replace(/\[|\]|\+/g, '').trim(),
          result: rule.split('>')[1].split('/')[0],
          preInput: rule.split('/')[1].split('_')[0].replace(/\[|\]|\+/g, '').trim(),
          postInput: rule.split('/')[1].split('_')[1].replace(/\[|\]|\+/g, '').trim(),
        }
      })
      return {epoch: epoch.name, rules: ruleBundle}
    })

    console.log(allEpochs)
    // apply sound changes
    allEpochs.reduce((diachronicLexicon, epoch) => {
      let startingLexicon = diachronicLexicon.length 
        ? diachronicLexicon[diachronicLexicon.length - 1]
        : lexicalFeatureBundles;
      let currentRules = epoch.rules;
      let resultingLexicon = startingLexicon.forEach(lexeme => {
        currentRules.forEach(rule => {
          let ruleEnvironment = [[rule.preInput], [rule.input], [rule.postInput]];
          console.log(ruleEnvironment)
        })
      })
      diachronicLexicon.push(resultingLexicon) 
    },[])

    // handle output
  }

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features phonemes={phonemes} setPhonemes={setPhonemes} features={features} setFeatures={setFeatures}/>
      <Epochs epochs={epochs} setEpochs={setEpochs} errors={errors}/>
      <Options options={options} setOptions={setOptions} runChanges={runChanges}/>
      <Output results={results} setResults={setResults}/>
    </div>
  );
}

export default PhonoChangeApplier;