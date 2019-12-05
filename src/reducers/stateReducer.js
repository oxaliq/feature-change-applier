const addPhones = (phones, phone) => {
  let node = {};
  phone.split('').forEach((graph, index) => {
    if (index) node[graph] = {}
    if (!index && !phones[graph]) phones[graph] = {} 
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.length - 1) node.grapheme = phone;
  })
  return phones;
}

const findPhone = (phones, phone) => {
  let node;
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
  });
  return node;
}

const addFeatureToPhone = (phones, phone, featureKey, featureValue) => {
  let node = {}
  phone.split('').forEach((graph, index) => {
    node = index === 0 ? phones[graph] : node[graph];
    if (index === phone.split('').length - 1) node.features = {...node.features, [featureKey]: featureValue}
  })
  return phones;
}

export const stateReducer = (state, action) => {
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

    default:
      return state;
  }
}

export const initState = () => {
  const state = {
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
    lexicon: [
      'anta', 'anat', 'anət', 'anna', 'tan', 'ənta'
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
        }
      },
      n: {
        grapheme: 'a', features: {
          sonorant: true, nasal: true, occlusive: true, coronal: true
        },
        t: {
          ʰ: {
            grapheme: 'ntʰ', features: {
              occlusive: true, nasal: true, coronal: true, obstruent: true, aspirated: true
            }
          }
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
    occlusive: { positive:[ state.phones.t, state.phones.n, state.phones.n.t.ʰ ], negative: [] },
    coronal: { positive:[ state.phones.t, state.phones.n, state.phones.n.t.ʰ ], negative: [] },
    obstruent: { positive:[ state.phones.t, state.phones.n, state.phones.n.t.ʰ ], negative: [] },
    nasal: { positive:[ state.phones.n ], negative: [] },
    aspirated: { positive:[ state.phones.n.t.ʰ ], negative: [] },
  }

  return state;
}