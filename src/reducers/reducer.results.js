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

const getProperty = property => object => object[property]

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

const errorMessage = ([prefix, separator], location, err) => `${prefix}${location}${separator}${err}`

const lintRule = (rule) => {
  if (!rule.match(/>/g)) throw `Insert '>' operator between target and result`
  if (!rule.match(/\//g)) throw `Insert '/' operator between change and environment`
  if (!rule.match(/_/g)) throw `Insert '_' operator in environment`
  if (rule.match(/>/g).length > 1) throw `Too many '>' operators`
  if (rule.match(/\//g).length > 1) throw `Too many '/' operators`
  if (rule.match(/_/g).length > 1) throw `Too many '_' operators`
  return rule.split(/>|\/|_/g);
}

const decomposeRule = (rule: string, index: number): ruleBundle => {
  try {
    // splits rule at '>' '/' and '_' substrings resulting in array of length 4
    const [position, newFeatures, pre, post] = lintRule(rule); 
    return { environment: { pre, position, post }, newFeatures }
  } catch (err) {
    throw errorMessage`Error in line ${index + 1}: ${err}`;
  }
}

const isUnknownFeatureToken = token => token !== '-' && token !== '+' && token !== ']' && token !== '[' && token !== ' ';

const doesFeatureRuleContainUnknownToken = features => {
  const unknownTokens = features
  .match(/\W/g)
  .filter(isUnknownFeatureToken)
  if (unknownTokens.length) throw `Unknown token '${unknownTokens[0]}'`;
  return true
}

const reduceFeaturesToBoolean = bool => (map, feature) => ({...map, [feature]: bool})

const getFeatures = (phoneme: string, featureBoolean): {} => {
  try {
    const featureMatch = featureBoolean
    // regEx to pull positive features
    ? /(?=\+.).*(?<=\-)|(?=\+.).*(?!\-).*(?<=\])/g 
    // regEx to pull negative features
    : /(?=\-.).*(?<=\+)|(?=\-.).*(?!\+).*(?<=\])/g
    const [ features ] = phoneme.match(featureMatch) || [ null ];
    if (features) {
      doesFeatureRuleContainUnknownToken(features)
      return features
      .trim()
      .match(/\w+/g)
      .reduce(reduceFeaturesToBoolean(featureBoolean), {})
    }
    return {}
  } catch (err) {
    throw err;
  }
}

const mapToPositiveAndNegativeFeatures = phoneme => (
  { ...getFeatures(phoneme, true), ...getFeatures(phoneme, false) } )

const mapStringToFeatures = (ruleString, phones) => {
  if (ruleString) {
    if (ruleString === '.') return [];
    if (ruleString === '#') return ['#']
    if (ruleString === '0') return [];
    const ruleBrackets = ruleString.match(/\[.*\]/)
    try {
      if (ruleBrackets) {
        return ruleString
        .split('[')
        // filter out empty strings
        .filter(v => v)
        .map(mapToPositiveAndNegativeFeatures)
      }
      return findFeaturesFromGrapheme(phones, ruleString);
    } catch (err) {
      throw err;
    }
  }
  return {};
}

const mapRuleBundleToFeatureBundle =  phones => ( ruleBundle, index ) => {
  // for each object in ruleBundle, map values to array of objects with feature-boolean key-value pairs
  try {
    const { newFeatures, environment:{ pre, position, post } } = ruleBundle;
    return {
      environment: {
        pre: mapStringToFeatures(pre, phones),
        position: mapStringToFeatures(position, phones),
        post: mapStringToFeatures(post, phones),
      },
      newFeatures: mapStringToFeatures(newFeatures, phones)
    }
  } catch (err) {
    throw errorMessage`Error in line ${index + 1}: ${err}`;
  }
}

export const decomposeRules = (epoch: epochType, phones: {[key: string]: phoneType}): decomposedRulesType => {
  const { changes } = epoch
  try {
    return changes
      .map(decomposeRule)
      .map(mapRuleBundleToFeatureBundle(phones));
  } catch (err) {
    const ruleError = {epoch: epoch.name, error: err}
    throw ruleError;
  }
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
  return ruleFeatures.filter(isPhonemeBoundByRule(phonemeFeatures)).length === ruleFeatures.length;
}

const getEntries = object => Object.entries(object);
const isObjectWithPropertyInArray = (array, property) => candidate => array.map(getProperty(property)).includes(candidate[property]);
const transformFeatureValues = features => ([newFeature, newValue]) => features[newFeature][newValue ? 'positive': 'negative'];
const reduceFeatureValues = (newPhoneme, [newFeature, newValue]) => ({ ...newPhoneme, [newFeature]: newValue })

const transformPhoneme = (phoneme, newFeatures, features) => {
  if (!newFeatures) return {}
  const newPhonemeFeatures = getEntries(newFeatures).reduce(reduceFeatureValues, {...phoneme.features});
  const newPhonemeCandidates = getEntries(newPhonemeFeatures).map(transformFeatureValues(features));
  return newPhonemeCandidates
    .reduce((candidates, candidatesSubset, index, array) => candidates.filter(isObjectWithPropertyInArray(candidatesSubset, 'grapheme'))
    , newPhonemeCandidates[newPhonemeCandidates.length - 1])[0];
}

const transformLexemeInitial = (newLexeme, pre, post, position, phoneme, index, lexemeBundle, newFeatures, features) => {
  if (index !== pre.length - 1) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule([phoneme], position)) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule(lexemeBundle.slice(index + position.length, index + post.length + position.length), post)) return [...newLexeme, phoneme];
  const newPhoneme = transformPhoneme(phoneme, newFeatures[0], features);
  // if deletion occurs
  if (!newPhoneme.grapheme) return [ ...newLexeme] ;
  return [...newLexeme, newPhoneme];
}

const transformLexemeCoda = (newLexeme, pre, post, position, phoneme, index, lexemeBundle, newFeatures, features) => {
  if (index + post.length !== lexemeBundle.length) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule(lexemeBundle.slice(index - pre.length, index), pre)) return [...newLexeme, phoneme];
  if (!isEnvironmentBoundByRule([phoneme], position)) return [...newLexeme, phoneme];
  const newPhoneme = transformPhoneme(phoneme, newFeatures[0], features);
  // if deletion occurs
  if (!newPhoneme.grapheme) return [ ...newLexeme] ;
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
    const newPhoneme = transformPhoneme(phoneme, rule.newFeatures[0], features);
    // if deletion occurs
    if (!newPhoneme || !newPhoneme.grapheme) return [ ...newLexeme] ;
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
const stringifyLexeme = (lexeme) => lexeme.map(getProperty('grapheme')).join('')
const stringifyResults = ({lexicon, ...passResults}) => ({...passResults, lexicon: lexicon.map(stringifyLexeme)})

export const run = (state: stateType, action: resultsAction): stateType => {

  // TODO iterate through each epoch
  try {
    const passResults = state.epochs.reduce((results, epoch, _) => {
      const { phones, features, lexicon } = state;
      let lexiconBundle;
      if ( epoch.parent ) {
        lexiconBundle = results.find(result => result.pass === epoch.parent).lexicon
      }
      if (!epoch.parent) {
        lexiconBundle = formBundleFromLexicon(lexicon)(phones); 
      }
      const ruleBundle = decomposeRules(epoch, phones);
      const passResults = transformLexicon(lexiconBundle)(ruleBundle)(features)
      const pass = { pass: epoch.name, lexicon: passResults }
      if ( epoch.parent ) pass.parent = epoch.parent;
      return [...results, pass];
    }, []);
    
    const results = passResults.map(stringifyResults);
    return {...state, results, errors: {} }
  } catch (err) {
    console.log(err)
    return {...state, errors: err, results:[] };
  }
}