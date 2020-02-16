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

const isPhonemeBoundByRule = (phonemeFeatures, ruleFeatures) => {
  if (!ruleFeatures) return true;
  const match = ruleFeatures.filter((ruleFeature, index) => {
    const phoneme = phonemeFeatures[index].features;
    return Object.entries(ruleFeature).reduce((bool, entry) => {
      if (!bool) return false;
      if (!phoneme[entry[0]] && !entry[1]) return true;
      if (phoneme[entry[0]] !== entry[1]) return false;
      return true;
    }, true);
  })
  return match.length === ruleFeatures.length ? true : false;
}

const swapPhoneme = (phoneme, newFeatures, features) => {
  const newPhonemeFeatures = Object.entries(newFeatures).reduce((newPhoneme, [newFeature, newValue]) => {
    return { ...newPhoneme, [newFeature]: newValue }
  }, {...phoneme.features})
  const newPhonemeCandidates = Object.entries(newPhonemeFeatures).map(([newFeature, newValue]) => {
    return features[newFeature][newValue ? 'positive': 'negative']
  })
  const newPhoneme = newPhonemeCandidates.reduce((candidates, value, index, array) => {
    return candidates.filter(candidate => value.map(val => val.grapheme).includes(candidate.grapheme))
  }, newPhonemeCandidates[newPhonemeCandidates.length - 1])
  return newPhoneme[0];
}

export const transformLexeme = (lexemeBundle, rule, features) => {
  const {pre, post, position} = rule.environment;
  const newLexeme = lexemeBundle.reduce((newLexeme, phoneme, index) => {
    if ( index < pre.length || index >= lexemeBundle.length - post.length ) return [...newLexeme, phoneme];
    if (!isPhonemeBoundByRule(lexemeBundle.slice(index - pre.length, index), pre)) return [...newLexeme, phoneme];
    if (!isPhonemeBoundByRule([phoneme], rule.environment.position)) return [...newLexeme, phoneme];
    if (!isPhonemeBoundByRule(lexemeBundle.slice(index, index + post.length), post)) return [...newLexeme, phoneme];
    const newPhoneme = swapPhoneme(phoneme, rule.newFeatures[0], features);
    return [...newLexeme, newPhoneme];
  }, [])
  return newLexeme;

}

export const run = (state: stateType, action: resultsAction): stateType => {

  // for each epoch
  // TODO iterate through each epoch
  const epoch = state.epochs[0];
  const phones = state.phones;
  const lexicon = state.lexicon;
  const features  = state.features;
  const ruleBundle = decomposeRules(epoch, phones);
  const lexiconBundle = lexicon.map(lexeme => findFeaturesFromLexeme(phones, lexeme.lexeme))
  
  const results = lexiconBundle.map(lexemeBundle => {
    return ruleBundle.reduce((lexeme, rule) => {
      return transformLexeme(lexeme, rule, features);
    }, lexemeBundle)
  })
  
  const stringifiedResults = results.map(lexemeBundle => {
    return Object.entries(lexemeBundle).map(phoneme => phoneme[1].grapheme).join('')
  })
  return {...state, results: { pass: state.epochs[0].name, results: stringifiedResults } }
}