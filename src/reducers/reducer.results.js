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
  const [position, newFeatures, pre, post] = rule.split(/>|\/|_/g); 
  return {
    environment: { pre, position, post },
    newFeatures
  }
}

const getPositiveFeatures = phoneme => {
  const positiveFeatures = phoneme.match(/(?=\+.).*(?<=\-)|(?=\+.).*(?!\-).*(?<=\])/g)
  return positiveFeatures ? positiveFeatures[0]
  .trim().match(/\w+/g)
  .reduce((map, feature) => ({...map, [feature]: true}), {})
  : {}
}

const getNegativeFeatures = phoneme => {
  const negativeFeatures = phoneme.match(/(?=\-.).*(?<=\+)|(?=\-.).*(?!\+).*(?<=\])/g)
  return negativeFeatures ? negativeFeatures[0]
  .trim().match(/\w+/g)
  .reduce((map, feature) => ({...map, [feature]: false}), {})
  : {}
}

const mapToPositiveAndNegativeFeatures = phoneme => (
  { ...getPositiveFeatures(phoneme), ...getNegativeFeatures(phoneme) } )

const mapStringToFeatures = (ruleString, phones) => {
  if (ruleString) {
    if (ruleString === '.') return [];
    if (ruleString === '#') return ['#']
    if (ruleString === '0') return [];
    const ruleBrackets = ruleString.match(/\[.*\]/)
    if (ruleBrackets) {
      return ruleString
        .split('[')
        // filter out empty strings
        .filter(v => v)
        .map(mapToPositiveAndNegativeFeatures)
    }
    return findFeaturesFromGrapheme(phones, ruleString);
  }
  return {};
}

const mapRuleBundleToFeatureBundle =  phones => ruleBundle => {
  // for each object in ruleBundle, map values to array of objects with feature-boolean key-value pairs
  const { newFeatures, environment:{ pre, position, post } } = ruleBundle;
  return {
    environment: {
      pre: mapStringToFeatures(pre, phones),
      position: mapStringToFeatures(position, phones),
      post: mapStringToFeatures(post, phones),
    },
    newFeatures: mapStringToFeatures(newFeatures, phones)
  }
}

export const decomposeRules = (epoch: epochType, phones: {[key: string]: phoneType}): decomposedRulesType => {
  const { changes } = epoch
  return changes.map(decomposeRule).map(mapRuleBundleToFeatureBundle(phones));
}

const isPhonemeBoundByRule  = phonemeFeatures => (ruleFeature, index) => {
  const phoneme = phonemeFeatures[index].features;
  return Object.entries(ruleFeature).reduce((bool, [feature, value]) => {
    if (!bool) return false;
    if (!phoneme.hasOwnProperty(feature)) return false;
    if (!phoneme[feature] && !value) return true;
    if (phoneme[feature] !== value) return false;
    return true;
  }, true);
} 

const isEnvironmentBoundByRule = (phonemeFeatures, ruleFeatures) => {
  if (!ruleFeatures) return true;
  return ruleFeatures.filter(isPhonemeBoundByRule(phonemeFeatures)).length === ruleFeatures.length 
    ? true : false;
}

const swapPhoneme = (phoneme, newFeatures, features) => {
  if (!newFeatures) return {}
  const newPhonemeFeatures = Object.entries(newFeatures)
    .reduce((newPhoneme, [newFeature, newValue]) => ({ ...newPhoneme, [newFeature]: newValue })
    , {...phoneme.features});
  const newPhonemeCandidates = Object.entries(newPhonemeFeatures)
    .map(([newFeature, newValue]) => features[newFeature][newValue ? 'positive': 'negative']);
  return newPhonemeCandidates
    .reduce((candidates, value, index, array) => candidates.filter(candidate => value.map(val => val.grapheme).includes(candidate.grapheme))
    , newPhonemeCandidates[newPhonemeCandidates.length - 1])[0];
}

const transformLexemeInitial = (newLexeme, pre, post, position, phoneme, index, lexemeBundle, newFeatures, features) => {
  if (index !== pre.length - 1) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule([phoneme], position)) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule(lexemeBundle.slice(index, index + post.length), post)) return [...newLexeme, phoneme];
  const newPhoneme = swapPhoneme(phoneme, newFeatures[0], features);
  return [...newLexeme, newPhoneme];
}

const transformLexemeCoda = (newLexeme, pre, post, position, phoneme, index, lexemeBundle, newFeatures, features) => {
  if (index + post.length !== lexemeBundle.length) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule(lexemeBundle.slice(index - pre.length, index), pre)) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule([phoneme], position)) return [...newLexeme, phoneme];
  const newPhoneme = swapPhoneme(phoneme, newFeatures[0], features);
  return [...newLexeme, newPhoneme];
}

export const transformLexeme = (lexemeBundle, rule, features) => {
  const {pre, post, position} = rule.environment;
  const newLexeme = lexemeBundle.reduce((newLexeme, phoneme, index) => {
    if (pre.find(val => val === '#')) return transformLexemeInitial(newLexeme, pre, post, position, phoneme, index, lexemeBundle, rule.newFeatures, features);
    if (post.find(val => val === '#')) return transformLexemeCoda(newLexeme, pre, post, position, phoneme, index, lexemeBundle, rule.newFeatures, features);
    if ( index < pre.length || index >= lexemeBundle.length - post.length ) return [...newLexeme, phoneme];
    if (!isEnvironmentBoundByRule(lexemeBundle.slice(index - pre.length, index), pre)) return [...newLexeme, phoneme];
    if (!isEnvironmentBoundByRule([phoneme], position)) return [...newLexeme, phoneme];
    if (!isEnvironmentBoundByRule(lexemeBundle.slice(index, index + post.length), post)) return [...newLexeme, phoneme];
    const newPhoneme = swapPhoneme(phoneme, rule.newFeatures[0], features);
    // if deletion occurs
    if (!newPhoneme.grapheme) return [ ...newLexeme] ;
    return [...newLexeme, newPhoneme];
  }, [])
  return newLexeme;
}

const formBundleFromLexicon = lexicon => phones => lexicon.map(({lexeme}) => findFeaturesFromLexeme(phones, lexeme))

const transformLexicon = lexiconBundle => 
  ruleBundle => 
  features => 
    lexiconBundle.map(lexemeBundle => ruleBundle.reduce(
      (lexeme, rule, i) => transformLexeme(lexeme, rule, features)
      , lexemeBundle
    ))

const getGraphemeFromEntry = ([_, phoneme]) => phoneme.grapheme
const stringifyResults = lexemeBundle => Object.entries(lexemeBundle).map(getGraphemeFromEntry).join('')

export const run = (state: stateType, action: resultsAction): stateType => {

  // TODO iterate through each epoch
  const epoch = state.epochs[0];

  const { phones, lexicon, features } = state;

  const ruleBundle = decomposeRules(epoch, phones);
  const lexiconBundle = formBundleFromLexicon(lexicon)(phones); 
  const passResults = transformLexicon(lexiconBundle)(ruleBundle)(features);
  const stringifiedPassResults = passResults.map(stringifyResults);
  console.log(passResults)
  const pass = {
    pass: epoch.name,
    lexicon: stringifiedPassResults
  }

  return {...state, results: [pass] }
}