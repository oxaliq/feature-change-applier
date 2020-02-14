// @flow
import type { stateType, epochType, phoneType } from './reducer';

export type resultsAction = {
  type: 'RUN'
}

export type decomposedRulesType = [
  {
    environment: {
      pre: [{[key: string]: boolean}],
      position: [{[key: string]: boolean}],
      post: [{[key: string]: boolean}]
    },
    newFeatures: [{[key: string]: boolean}]
  }
]

const findFeaturesFromLexeme = (phones: {}, lexeme:string): [] => {
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
const findFeaturesFromGrapheme = (phones: {}, lexeme:string): [] => {
  let featureBundle = []
  let lastIndex = lexeme.length - 1;
  let node = {};
  [...lexeme].forEach((graph, index) => {
    if (!index && !lastIndex) featureBundle.push(phones[graph].features)
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

const decomposeRule = (rule: string) => {
  let decomposedChange = rule.split('>');
  decomposedChange = [decomposedChange[0], ...decomposedChange[1].split('/')]
  decomposedChange = [decomposedChange[0], decomposedChange[1], ...decomposedChange[2].split('_')];
  const ruleBundle = {
    environment: {
      pre: decomposedChange[2], 
      position: decomposedChange[0], 
      post: decomposedChange[3]
    },
    newFeatures: decomposedChange[1]
  }
  return ruleBundle;
}

const mapStringToFeatures = (ruleString, phones) => {
  if (ruleString) {
    const ruleBrackets = ruleString.match(/\[.*\]/)
    if (ruleBrackets) {
      const ruleFeatures = ruleString.match(/(?!\[).*(?<!\])/)[0]
      const plusIndex = ruleFeatures.indexOf('+');
      const minusIndex = ruleFeatures.indexOf('-');
      const positiveFeatures = ruleFeatures.slice(plusIndex + 1, minusIndex).trim().split(' ');
      const positiveFeaturesMap = positiveFeatures.map(feature => ({[feature]: true}))
      const negativeFeatures = ruleFeatures.slice(minusIndex +1).trim().split(' ');
      const negativeFeaturesMap = negativeFeatures.map(feature => ({[feature]: false}))
      return {...positiveFeaturesMap, ...negativeFeaturesMap}
    }
    const grapheme = ruleString;
    return findFeaturesFromGrapheme(phones, grapheme);
  }
  return {};
}

const mapRuleBundleToFeatureBundle = (ruleBundle, phones) => {
  // ! for each object in ruleBundle, map values to array of objects with feature-boolean key-value pairs
  const featureBundle = {...ruleBundle};
  console.log(featureBundle)
  featureBundle.environment.pre = mapStringToFeatures(featureBundle.environment.pre, phones);
  console.log(featureBundle.environment.pre)
  featureBundle.environment.position = mapStringToFeatures(featureBundle.environment.position, phones);
  console.log(featureBundle.environment.position)
  featureBundle.environment.post = mapStringToFeatures(featureBundle.environment.post, phones);
  console.log(featureBundle.environment.post)
  featureBundle.newFeatures = mapStringToFeatures(featureBundle.newFeatures, phones);
  console.log(featureBundle.newFeatures)
  return featureBundle;
}

export const decomposeRules = (epoch: epochType, phones: {[key: string]: phoneType}): decomposedRulesType => {
  let ruleBundle = [...epoch.changes]
  ruleBundle = epoch.changes.map(rule => decomposeRule(rule));
  const featureBundle = ruleBundle.map(rule => mapRuleBundleToFeatureBundle(rule, phones));
  return featureBundle;
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
  
  let featurePhoneBundle = state.lexicon.map(lexeme => findFeaturesFromLexeme(state.phones, lexeme))
  
  console.log(featurePhoneBundle)
  ruleBundle.forEach(rule => {
    featurePhoneBundle.map(featurePhone => {
      // if (findRules(featurePhone, )
    })
})

  let results = [];
  return {...state, results: { pass: state.epochs[0].name, results } }
}