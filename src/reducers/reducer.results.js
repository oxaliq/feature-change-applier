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

type ruleBundle = {
  environment: {
    pre: string,
    position: string,
    post: string
  },
  newFeatures: string
}

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

const decomposeRule = (rule: string): ruleBundle => {
  // splits rule at '>' '/' and '_' substrings resulting in array of length 4
  const decomposedChange = rule.split(/>|\/|_/g); 
  
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
    if (ruleString === '.') return [];
    const ruleBrackets = ruleString.match(/\[.*\]/)
    if (ruleBrackets) {
      const ruleFeatures = ruleString
        .split('[')
        // filter out empty strings
        .filter(v => v)
        .map((phoneme) => {
          const positiveFeatures = phoneme.match(/(?=\+.).*(?<=\-)|(?=\+.).*(?!\-).*(?<=\])/g)
          const positiveFeaturesMap = positiveFeatures ? positiveFeatures[0]
          .trim().match(/\w+/g)
          .reduce((map, feature) => ({...map, [feature]: true}), {})
          : {}
          
          const negativeFeatures = phoneme.match(/(?=\-.).*(?<=\+)|(?=\-.).*(?!\+).*(?<=\])/g)
          const negativeFeaturesMap = negativeFeatures ? negativeFeatures[0]
          .trim().match(/\w+/g)
          .reduce((map, feature) => ({...map, [feature]: false}), {})
          : {}

          return {...positiveFeaturesMap, ...negativeFeaturesMap}
        })
        return ruleFeatures;
    }
    const grapheme = ruleString;
    return findFeaturesFromGrapheme(phones, grapheme);
  }
  return {};
}

const mapRuleBundleToFeatureBundle = (ruleBundle, phones) => {
  // for each object in ruleBundle, map values to array of objects with feature-boolean key-value pairs
  const featureBundle = {...ruleBundle};
  featureBundle.environment.pre = mapStringToFeatures(featureBundle.environment.pre, phones);
  featureBundle.environment.position = mapStringToFeatures(featureBundle.environment.position, phones);
  featureBundle.environment.post = mapStringToFeatures(featureBundle.environment.post, phones);
  featureBundle.newFeatures = mapStringToFeatures(featureBundle.newFeatures, phones);
  return featureBundle;
}

export const decomposeRules = (epoch: epochType, phones: {[key: string]: phoneType}): decomposedRulesType => {
  let ruleBundle = [...epoch.changes]
  ruleBundle = epoch.changes.map(rule => decomposeRule(rule));
  const featureBundle = ruleBundle.map(rule => mapRuleBundleToFeatureBundle(rule, phones));
  return featureBundle;
}

export const run = (state: stateType, action: resultsAction): stateType => {

  // for each epoch
  // TODO iterate through each epoch
  let ruleBundle = state.epochs[0].changes;

    // for each rule in epoch
    ruleBundle = ruleBundle.map(rule => decomposeRule(rule))
      // parse rule into feature bundles for 
        // environment
          // pre-target
          // post-target
        // target
        // mutation
      // for each item in lexicon
        // match targets in environments
        // mutate target
        // temporarily store lexical item
    // store lexical items in resulting epoch



  
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