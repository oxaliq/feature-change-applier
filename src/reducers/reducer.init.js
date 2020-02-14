// @flow
import type { stateType } from './reducer';

export type initAction = {
  type: "INIT"
}

export const initState = (changesArgument: number = -1): stateType => {
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
    options: {
      output: 'default', save: false
    },
    results: [],
    errors: {},
    features: {},
    lexicon: []
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
  state.lexicon = [
      {lexeme: 'anta', epoch: state.epochs[0]}, 
      {lexeme: 'anat', epoch: state.epochs[0]},
      {lexeme: 'anət', epoch: state.epochs[0]},
      {lexeme: 'anna', epoch: state.epochs[0]}, 
      {lexeme: 'tan', epoch: state.epochs[0]},
      {lexeme: 'ənta', epoch: state.epochs[0]}
  ]

  if(changesArgument > -1) state.epochs[0].changes = state.epochs[0].changes.splice(changesArgument, 1)

  return state;
}