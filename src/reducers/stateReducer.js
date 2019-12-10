// @flow
type stateType = {
  lexicon: Array<?string>,
  epochs: Array<?{name: string, changes: Array<string>}>,
  phones: {[key: string]: phoneType},
  options: {},
  results: {},
  errors: {},
  features: featureType
}

type phoneType = {
  grapheme: string,
  features: {[key: string]: boolean}
}

type featureType = {
  [key: string]: {[key: string]: Array<phoneType>}
}

const addPhones = (phones: {}, phone: string): {} => {
  let node = {};
  phone.split('').forEach((graph, index) => {
    if (index) node[graph] = {}
    if (!index && !phones[graph]) phones[graph] = {} 
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.length - 1) node.grapheme = phone;
  })
  return phones;
}

const findPhone = (phones: {}, phone: string): {} => {
  let node = {};
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
  });
  return node;
}

const addFeatureToPhone = (
    phones: {}, phone: string, featureKey: string, featureValue: boolean
  ): {} => 
  {
    let node = {}
    phone.split('').forEach((graph, index) => {
      node = index === 0 ? phones[graph] : node[graph];
      if (index === phone.split('').length - 1) node.features = {...node.features, [featureKey]: featureValue}
    })
    return phones;
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

export const stateReducer = (state: stateType, action: {type: string, value: {}}) => {
  switch (action.type) {
    case 'INIT': {
      return initState();
    }
    
    case 'ADD_LEXEME': {
      let newLexeme = action.value;
      if (!newLexeme.epoch) newLexeme.epoch = state.epochs[0].name;
      return {...state, lexicon:[...state.lexicon, newLexeme]}
    }
    
    case 'SET_LEXICON': {
      let newLexicon = action.value;
      newLexicon = newLexicon.map(lexeme => lexeme.epoch 
        ? lexeme 
        : {...lexeme, epoch: state.epochs[0].name});
      return {...state, lexicon: newLexicon}
    }

    case 'ADD_EPOCH': {
      let newEpoch = action.value;
      return {...state, epochs: [...state.epochs, newEpoch]}
    }

    case 'SET_EPOCH': {
      let mutatedEpochs = state.epochs;
      let index = [action.value.index]

      mutatedEpochs[index].name = action.value.name 
        ? action.value.name 
        : mutatedEpochs[index].name;

      mutatedEpochs[index].changes = action.value.changes 
        ? action.value.changes 
        : mutatedEpochs[index].changes;
      return {...state, epochs: [...mutatedEpochs]}
    }

    case 'ADD_FEATURE': {
      let positivePhones = action.value.positivePhones || [];
      let negativePhones = action.value.negativePhones || [];
      let newFeatureName = action.value.feature;
      
      let newPhoneObject = [
        ...positivePhones, ...negativePhones
      ].reduce((phoneObject, phone) => addPhones(phoneObject, phone), state.phones)
      
      if (positivePhones) {

        positivePhones.reduce(
          (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, true)
          , newPhoneObject
        );

        positivePhones = positivePhones.map( positivePhone => findPhone(newPhoneObject, positivePhone) )
      }
      
      if (negativePhones) {
        
        negativePhones.reduce(
          (phoneObject, positivePhone) => addFeatureToPhone(phoneObject, positivePhone, newFeatureName, false)
          , newPhoneObject
          );
          
        negativePhones = negativePhones.map( negativePhone => findPhone(newPhoneObject, negativePhone) )
      }
      
      let newFeature = {[action.value.feature]: {positive: positivePhones, negative: negativePhones}};
      return {...state, features:{...state.features, ...newFeature}, phones: newPhoneObject}
    }

    case 'RUN': {
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

    default:
      return state;
  }
}

export const initState = (changesArgument: number = -1): stateType => {
  const state = {
    lexicon: [
      'anta', 'anat', 'anət', 'anna', 'tan', 'ənta'
    ],
    epochs: [
      {
        name: 'epoch 1',
        changes: [
          '[+ occlusive - nasal]>[+ occlusive nasal]/n_',
          'at>ta/_#',
          '[+ sonorant - low rounded high back]>_/_',
          'nn>nun/_',
          '[+ nasal][+ obstruent]>[+ nasal obstruent aspirated ]/#_',
          '[+ sonorant rounded]>[+ sonorant - rounded]/_#'
        ]
      }
    ],
    phones: {
      a: {
        grapheme: 'a', features: {
          sonorant: true, back: true, low: true, high: false, rounded: false
        }
      },
      u: {
        grapheme: 'u', features: {
          sonorant: true, back: true, low: false, high: true, rounded: true, 
        }
      },
      ɯ: {
        grapheme: 'ɯ', features: {
          sonorant: true, back: true, low: false, high: true, rounded: false,
        }
      },
      ə: {
        grapheme: 'ə', features: {
          sonorant: true, low: false, rounded: false, high: false, back: false
        }
      },
      t: {
        grapheme: 't', features: {
          occlusive: true, coronal: true, obstruent: true
        },
        ʰ: {
          grapheme: 'tʰ', features: {
            occlusive: true, coronal: true, obstruent: true, aspirated: true
          }
        }
      },
      n: {
        grapheme: 'n', features: {
          sonorant: true, nasal: true, occlusive: true, coronal: true
        }
      }
    },
    options: {},
    results: {},
    errors: {},
    features: {}
  };
  state.features = {
    sonorant: { positive:[ state.phones.a, state.phones.u, state.phones.ɯ, state.phones.ə, state.phones.n], negative: [] },
    back: { positive:[ state.phones.a, state.phones.u, state.phones.ɯ ], negative: [ state.phones.ə ] },
    low: { positive:[ state.phones.a ], negative: [ state.phones.u, state.phones.ɯ, state.phones.ə ] },
    high: { positive:[ state.phones.u, state.phones.ɯ ], negative: [ state.phones.a, state.phones.ə ] },
    rounded: { positive:[ state.phones.u ], negative: [ state.phones.a, state.phones.ɯ, state.phones.ə ] },
    occlusive: { positive:[ state.phones.t, state.phones.n, state.phones.t.ʰ ], negative: [] },
    coronal: { positive:[ state.phones.t, state.phones.n, state.phones.t.ʰ ], negative: [] },
    obstruent: { positive:[ state.phones.t, state.phones.n, state.phones.t.ʰ ], negative: [] },
    nasal: { positive:[ state.phones.n ], negative: [] },
    aspirated: { positive:[ state.phones.t.ʰ ], negative: [] },
  }

  if(changesArgument > -1) state.epochs[0].changes = state.epochs[0].changes.splice(changesArgument, 1)

  return state;
}