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
  const { lexicon, phones, phonemes, epochs, options, features, results } = state;
  // ! UNDONE
  const [ errors, setErrors ] = useState({})

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
      lexicalFeatureBundles.push(lexemeBundle);
    })
    
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
      <ProtoLang lexicon={lexicon} dispatch={dispatch}/>
      <Features phones={phones} features={features} dispatch={dispatch}/>
      <Epochs epochs={epochs} dispatch={dispatch} />
      <Options options={options} dispatch={dispatch}/>
      <Output results={results} options={options} dispatch={dispatch}/>
    </div>
  );
}

export default PhonoChangeApplier;