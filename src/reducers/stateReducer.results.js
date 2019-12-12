// @flow
import type { stateType } from './stateReducer';

export type resultsAction = {
  type: 'RUN'
}

const findFeatures = (phones: {}, lexeme:string): [] => {
  let featureBundle = []
  let lastIndex = lexeme.length - 1;
  let node = {};
  [...lexeme].forEach((graph, index) => {
    if (!index) return node = phones[graph]
    if (index === lastIndex) return node[graph] 
      ? featureBundle.push(node[graph])
      : featureBundle.push(node, phones[graph])
    if (!node[graph] && node.features) {
      featureBundle.push(node)
      return node = phones[graph]
    }
    if (!node[graph])
    return node = node[graph]
  })
  return featureBundle;
}

const decomposeRule = (rule: string): string[] => {
  let decomposedChange = rule.split('>');
  decomposedChange = [decomposedChange[0], ...decomposedChange[1].split('/')]
  decomposedChange = [decomposedChange[0], decomposedChange[1], ...decomposedChange[2].split('_')];
  return [...decomposedChange];
}

export const run = (state: stateType, action: resultsAction): stateType => {
  // ! one epoch only
  // rule 0 '[+ occlusive - nasal]>[+ occlusive nasal]/n_'
  let ruleBundle = state.epochs[0].changes;
  ruleBundle = ruleBundle.map(rule => decomposeRule(rule))
  
  ruleBundle.map(rule => {
    rule.forEach(position => {
      console.log(position)
    })
  })
  
  let featurePhoneBundle = state.lexicon.map(lexeme => findFeatures(state.phones, lexeme))
  
  console.log(featurePhoneBundle)
  ruleBundle.forEach(rule => {
    featurePhoneBundle.map(featurePhone => {
      // if (findRules(featurePhone, )
    })
})

  let results = [];
  return {...state, results: { pass: state.epochs[0].name, results } }
}