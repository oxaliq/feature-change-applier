// @flow
import type { stateType } from './reducer';

export type initAction = {
  type: "INIT"
}

export const clearState = () => {
  return {
    epochs: [],
    phones: {},
    options: { output: 'default', save: false },
    results: [],
    errors: {},
    features: {},
    lexicon: [],
    latl: '',
    parseResults: ''
  }
}

export const waffleState = () => {
  return {
    epochs: [],
    phones: {},
    options: { output: 'default', save: false },
    results: [],
    errors: {},
    features: {},
    lexicon: [],
    latl: waffleLatl,
    parseResults: ''
  }
}

export const initState = (changesArgument: number): stateType => {
  const state = {
    epochs: [
      {
        name: 'epoch-1',
        changes: [
          '[+ occlusive - nasal]>[+ occlusive + nasal]/n_.',
          'a>ɯ/._#',
          '[+ sonorant - low rounded high back]>0/._.',
          '[+ obstruent]>[+ obstruent aspirated ]/#_.',
          '[+ sonorant - rounded]>[+ sonorant + rounded]/._#',
          // 'at>ta/._#'
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
          occlusive: true, coronal: true, obstruent: true, nasal: false
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
    lexicon: [],
    latl: '',
    parseResults: ''
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
    nasal: { positive:[ state.phones.n ], negative: [state.phones.t, state.phones.t.ʰ] },
    aspirated: { positive:[ state.phones.t.ʰ ], negative: [ state.phones.t ] },
  }
  state.lexicon = [
      {lexeme: 'anta', epoch: state.epochs[0]}, 
      {lexeme: 'anat', epoch: state.epochs[0]},
      {lexeme: 'anət', epoch: state.epochs[0]},
      {lexeme: 'anna', epoch: state.epochs[0]}, 
      {lexeme: 'tan', epoch: state.epochs[0]},
      {lexeme: 'ənta', epoch: state.epochs[0]}
  ]

  if(changesArgument > -1) state.epochs[0].changes = state.epochs[0].changes.splice(0, changesArgument)

  return state;
}

const waffleLatl = `
; -------- main class features

[consonantal
  += 
    ; PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; AFFRICATES
    tʃ / dʒ /
    ; FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; NASALS
    m ɱ / n / ŋ /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; SYLLABIC CONSONANTS 
    m̩ / n̩ / l̩ / ɹ̩
  -= 
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; GLIDES
    j / w / 
    ; LARYNGEALS
    h ɦ / ʔ
]

[sonorant
  += 
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; GLIDES
    j / w w̥ /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; NASALS
    m ɱ / n / ŋ /
    ; SYLLABIC CONSONANTS  
    m̩ / n̩ / l̩ / ɹ̩
  -= 
    ; PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; AFFRICATES
    tʃ / dʒ /
    ; FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; LARYNGEALS
    h ɦ / ʔ
]
[approximant
  += 
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; GLIDES
    j / w /
    ; SYLLABIC LIQUIDS
    l̩ / ɹ̩
  -=
    ; PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; AFFRICATES
    tʃ / dʒ /
    ; FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; NASALS
    m ɱ / n / ŋ /
    ; SYLLABIC NASALS 
    m̩ / n̩
]



; -------- laryngeal features

[voice
  +=
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; GLIDES
    j / w /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; NASALS
    m ɱ / n / ŋ /
    ; SYLLABIC CONSONANTS  
    m̩ / n̩ / l̩ / ɹ̩ /
    ; VOICED FRICATIVES
    v / ð / z / ʒ /
    ; VOICED AFFRICATES
    dʒ /
    ; VOICED LARYNGEALS
    ; LARYNGEALS
    ɦ
  -= voiceless obstruents
    ; PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; VOICELESS AFFRICATES
    tʃ / /
    ; VOICELESS FRICATIVES
    f / θ / s / ʃ / ç / x /
    ; VOICELESS LARYNGEALS
    h / ʔ
]

[spreadGlottis
  += 
    ; ASPIRATED PLOSIVES
    pʰ / tʰ / kʰ /
    ; ASPIRATED AFFRICATES
   /
    ; SPREAD LARYNGEALS
    h ɦ  
  -= 
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; UNASPIRATED PLOSIVES
    p / pʼ / t / tʼ / ɾ / k / kʼ /
    ; UNASPIRATED AFFRICATES 
    tʃ / dʒ /
    ; FRICATIVES 
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; NASAL OBSTRUENTS 
     m ɱ / n / ŋ /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; SYLLABIC CONSONANTS 
    m̩ / n̩ / l̩ / ɹ̩ /
    ; GLIDES 
    j / w
    ; CONSTRICTED LARYNGEALS
    ʔ
]
[constrictedGlottis
  += 
    ; LARYNGEALIZED RHOTIC
    ɹˤ /
    ; CONSTRICTED LARYNGEAL
    ʔ / 
    ; EJECTIVE PLOSIVES
    pʼ / tʼ / kʼ
  -=
    ; VOWELS 
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; PLOSIVES 
    p / pʰ / t / tʰ ɾ / k / kʰ /
    ; AFFRICATES 
    tʃ / dʒ /
    ; FRICATIVES 
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; NASAL OBSTRUENTS 
    m ɱ / n / ŋ /
    ; LIQUIDS 
    l /
    ; NON-PHARYNGEALIZED RHOTICS 
    ɹ ɹʲ /
    ; SYLLABIC CONSONANTS 
    m̩ / n̩ / l̩ / ɹ̩
    ; GLIDES
    j / w
    ; SPREAD LARYNGEALS 
    h ɦ /
]


; -------- manner features

[continuant
  +=
    ; FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; GLIDES
    j / w /
    ; SYLLABIC LIQUIDS
    l̩ / ɹ̩ /
    ; TAPS
    ɾ
  -= 
    ; NON-TAP PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ / k / kʼ / kʰ /
    ; AFFRICATES
    tʃ / dʒ /
    ; NASALS
    m ɱ / n / ŋ /
    ; SYLLABIC NASALS
    m̩ / n̩ 
]

[nasal
  +=
    ; NASALS
    m ɱ / n / ŋ /
    ; SYLLABIC NASALS
    m̩ / n̩ 
  -=
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x /
    ; LIQUIDS + RHOTICS
    l / ɹ ɹʲ ɹˤ /
    ; GLIDES
    j / w /
    ; SYLLABIC LIQUIDS
    l̩ / ɹ̩ /
    ; PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; AFFRICATES
    tʃ / dʒ /
]

[strident
  += 
    ; STRIDENT FRICATIVES
    f / v / s / z / ʃ / ʒ /
    ; STRIDENT AFFRICATES
    tʃ / dʒ
  -=
    ; VOWELS 
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; PLOSIVES 
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; NON-STRIDENT FRICATIVES
    θ / ð / ç / x /
    ; NASAL OBSTRUENTS
    m ɱ / n / ŋ /
    ; RHOTICS + LIQUIDS
    l / ɹ ɹʲ ɹˤ /
    ; SYLLABIC CONSONANTS 
    m̩ / n̩ / l̩ / ɹ̩ /
    ; GLIDES 
    j / w
]

[lateral
  += 
    ; LATERAL LIQUIDS
    l /
    ; SYLLABIC LATERALS /
    l̩
  -=
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; PLOSIVES 
    p / pʼ / pʰ / t / tʼ / tʰ ɾ / k / kʼ / kʰ
    ; AFFRICATES
    tʃ / dʒ
    ; FRICATIVES 
    f / v / θ / ð / s / z / ʃ / ʒ / ç / x
    ; NASAL OBSTRUENTS 
    m ɱ / n / ŋ
    ; RHOTIC LIQUIDS 
    ɹ ɹʲ ɹˤ
    ; NON-LIQUID SYLLABIC CONSONANTS 
    m̩ / n̩ / ɹ̩
    ; GLIDES 
    j / w
]



; -------- ---- PLACE features
; -------- labial features
[labial
  +=
    ; ROUNDED VOWELS 
    u̟ / ʊ̞ / ɔ /
    ; LABIAL PLOSIVES
    p / pʼ / pʰ /
    ; LABIAL FRICATIVES
    f / v /
    ; LABIAL NASALS
    m ɱ /
    ; LABIAL SYLLABIC CONSONANTS
    m̩ /
    ; LABIAL GLIDES
    w
  -=
    ; UNROUNDED VOWELS
    æ / e / ə / ɑ / ɪ̞ / ɛ / ʌ / i /
    ; NON-LABIAL PLOSIVES 
    t / tʼ / tʰ ɾ / k / kʼ / kʰ /
    ; NON-LABIAL AFFRICATES 
    tʃ / dʒ /
    ; NON-LABIAL FRICATIVES 
    θ / ð / s / z / ʃ / ʒ / ç / x /
    ; NON-LABIAL NASAL OBSTRUENTS 
    n / ŋ /
    ; LIQUIDS 
    l /
    ; RHOTIC LIQUIDS 
    ɹ ɹʲ ɹˤ /
    ; NON-LABIAL SYLLABIC CONSONANTS 
    n̩ / l̩ / ɹ̩ /
    ; NON-LABIAL GLIDES 
    j 
]

; -------- coronal features

[coronal
  +=
    ; CORONAL PLOSIVES
    t / tʼ / tʰ ɾ /
    ; CORONAL AFFRICATES
    tʃ / dʒ /
    ; CORONAL FRICATIVES
    θ / ð / s / z / ʃ / ʒ /
    ; CORONAL NASALS
    n /
    ; CORONAL LIQUIDS
    l
    ; CORONAL RHOTIC LIQUIDS
    ɹ 
    ; CORONAL SYLLABIC CONSONANTS
    n̩ / l̩ / ɹ̩
  -=
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; NON-CORONAL PLOSIVES
    p / pʼ / pʰ / k / kʼ / kʰ
    ; NON-CORONAL FRICATIVES
    f / v / ç / x
    ; NON-CORONAL NASAL OBSTRUENTS
    m ɱ / ŋ
    ; NON-CORONAL RHOTIC LIQUIDS
    ɹʲ ɹˤ
    ; NON-CORONAL SYLLABIC CONSONANTS
    m̩ / 
    ; NON-CORONAL GLIDES
    j / w
]

[anterior
  +=
    ; ALVEOLAR PLOSIVES
    t / tʼ / tʰ ɾ /
    ; ALVEOLAR AFFRICATES
    tʃ / dʒ /
    ; DENTAL FRICATIVES
    θ / ð /
    ; ALVEOLAR FRICATIVES
    s / z /
    ; ALVEOLAR NASALS
    n /
    ; ALVEOLAR LIQUIDS
    l
    ; ALVEOLAR SYLLABIC CONSONANTS
    n̩ / l̩ /
  -=
    ; POSTALVEOLAR FRICATIVES
    ʃ / ʒ /
    ; POSTALVEOLAR RHOTIC LIQUIDS
    ɹ /
    ; POSTALVEOLAR SYLLABIC CONSONANTS
    ɹ̩ /
    ; -- NON-CORONALs
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; NON-CORONAL PLOSIVES
    p / pʼ / pʰ / k / kʼ / kʰ
    ; NON-CORONAL FRICATIVES
    f / v / ç / x
    ; NON-CORONAL NASAL OBSTRUENTS
    m ɱ / ŋ
    ; NON-CORONAL RHOTIC LIQUIDS
    ɹʲ ɹˤ
    ; NON-CORONAL SYLLABIC CONSONANTS
    m̩ / 
    ; NON-CORONAL GLIDES
    j / w
]

[distributed
  +=
    ; DENTAL FRICATIVES
    θ / ð /
    ; POSTALVEOLAR FRICATIVES
    ʃ / ʒ /
    ; POSTALVEOLAR RHOTIC LIQUIDS
    ɹ /
    ; POSTALVEOLAR SYLLABIC CONSONANTS
    ɹ̩ /
  -= 
    ; apical / retroflex
    ; ALVEOLAR PLOSIVES
    t / tʼ / tʰ ɾ /
    ; ALVEOLAR FRICATIVES
    s / z /
    ; ALVEOLAR NASALS
    n /
    ; ALVEOLAR LIQUIDS
    l
    ; ALVEOLAR SYLLABIC CONSONANTS
    n̩ / l̩ /
    ; -- NON-CORONALS
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; NON-CORONAL PLOSIVES
    p / pʼ / pʰ / k / kʼ / kʰ
    ; NON-CORONAL FRICATIVES
    f / v / ç / x
    ; NON-CORONAL NASAL OBSTRUENTS
    m ɱ / ŋ
    ; NON-CORONAL RHOTIC LIQUIDS
    ɹʲ ɹˤ
    ; NON-CORONAL SYLLABIC CONSONANTS
    m̩ / 
    ; NON-CORONAL GLIDES
    j / w
]

; -------- dorsal features

[dorsal
  +=
    ; VOWELS
    æ / e / ə / ɑ / ɔ / ɪ̞ / ɛ / ʌ / ʊ̞ / i / u̟ /
    ; DORSAL PLOSIVES 
    k / kʼ / kʰ /
    ; DORSAL FRICATIVES 
    ç / x /
    ; DORSAL NASAL OBSTRUENTS
    ŋ /
    ; DORSAL RHOTIC LIQUIDS
    ɹʲ  ɹˤ
    ; DORSAL GLIDES
    j
  -=
    ; NON-DORSAL PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ /
    ; NON-DORSAL AFFRICATES
    tʃ / dʒ /
    ; NON-DORSAL FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ /
    ; NON-DORSAL NASALS
    m ɱ / n /
    ; NON-DORSAL LIQUIDS
    l
    ; NON-DORSAL RHOTIC LIQUIDS
    ɹ 
    ; NON-DORSAL SYLLABIC CONSONANTS
    m̩ / n̩ / l̩ / ɹ̩
    ; NON-DORSAL GLIDES
    w
]

[high
  += 
    ; HIGH VOWELS
    i / u̟ / ʊ̞ / ɪ̞
    ; HIGH DORSAL PLOSIVES 
    k / kʼ / kʰ /
    ; HIGH DORSAL FRICATIVES 
    ç / x /
    ; HIGH DORSAL NASAL OBSTRUENTS
    ŋ /
    ; HIGH RHOTIC LIQUIDS
    ɹʲ  
    ; HIGH DORSAL GLIDES
    j / w
  -= χ / e / o / a
    ; NON-HIGH VOWELS 
    ɑ / æ / e / ə / ɛ / ʌ
    ; NON-HIGH RHOTIC LIQUIDS
    ɹˤ
    ; -- NON-DORSALS
    ; NON-DORSAL PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ /
    ; NON-DORSAL AFFRICATES
    tʃ / dʒ /
    ; NON-DORSAL FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ /
    ; NON-DORSAL NASALS
    m ɱ / n /
    ; NON-DORSAL LIQUIDS
    l
    ; NON-DORSAL RHOTIC LIQUIDS
    ɹ 
    ; NON-DORSAL SYLLABIC CONSONANTS
    m̩ / n̩ / l̩ / ɹ̩
    ; NON-DORSAL GLIDES
    w
]

[low
  +=
    ; LOW VOWELS
    ɑ / æ / ɛ /
    ; LOW DORSAL RHOTIC LIQUIDS
    ɹˤ
  -= a / ɛ / ɔ
    ; NON-LOW VOWELS
    i / u̟ / ʊ̞ / ɪ̞ / e / ə / ʌ
    ; NON-LOW DORSAL PLOSIVES 
    k / kʼ / kʰ /
    ; NON-LOW DORSAL FRICATIVES 
    ç / x /
    ; NON-LOW DORSAL NASAL OBSTRUENTS
    ŋ /
    ; NON-LOW DORSAL RHOTIC LIQUIDS
    ɹʲ
    ; DORSAL GLIDES
    j
    ; -- NON-DORSALS
    ; NON-DORSAL PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ /
    ; NON-DORSAL AFFRICATES
    tʃ / dʒ /
    ; NON-DORSAL FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ /
    ; NON-DORSAL NASALS
    m ɱ / n /
    ; NON-DORSAL LIQUIDS
    l
    ; NON-DORSAL RHOTIC LIQUIDS
    ɹ 
    ; NON-DORSAL SYLLABIC CONSONANTS
    m̩ / n̩ / l̩ / ɹ̩
    ; NON-DORSAL GLIDES
    w
]
[back
  += 
    ; BACK VOWELS
    ɑ / ɔ / ʌ / ʊ̞ / u̟ /
    ; BACK DORSAL PLOSIVES 
    k / kʼ / kʰ /
    ; BACK DORSAL FRICATIVES
    x /
    ; BACK DORSAL NASAL OBSTRUENTS
    ŋ /
    ; BACK DORSAL RHOTIC LIQUIDS
    ɹˤ
  -=
    ; NON-BACK DORSAL FRICATIVES 
    ç /
    ; NON-BACK DORSAL RHOTIC LIQUIDS
    ɹʲ  
    ; NON-BACK DORSAL GLIDES
    j
    ; NON-BACK VOWELS
    æ / e / ə / ɪ̞ / ɛ / i
    ; -- NON-DORSALS
    ; NON-DORSAL PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ /
    ; NON-DORSAL AFFRICATES
    tʃ / dʒ /
    ; NON-DORSAL FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ /
    ; NON-DORSAL NASALS
    m ɱ / n /
    ; NON-DORSAL LIQUIDS
    l
    ; NON-DORSAL RHOTIC LIQUIDS
    ɹ 
    ; NON-DORSAL SYLLABIC CONSONANTS
    m̩ / n̩ / l̩ / ɹ̩
    ; NON-DORSAL GLIDES
    w
]
[tense ; compare to ATR or RTR
  += 
    ; TENSE VOWELS 
    e / i / u̟ / ɑ 
  -=
    ; NON-TENSE VOWELS 
    æ / ə / ɪ̞ / ɛ / ʌ / ʊ̞ / ɔ /
    ; DORSAL PLOSIVES 
    k / kʼ / kʰ /
    ; DORSAL FRICATIVES 
    ç / x /
    ; DORSAL NASAL OBSTRUENTS
    ŋ /
    ; DORSAL RHOTIC LIQUIDS
    ɹʲ  ɹˤ /
    ; DORSAL GLIDES
    j
    ; -- NON-DORSALS
    ; NON-DORSAL PLOSIVES
    p / pʼ / pʰ / t / tʼ / tʰ ɾ /
    ; NON-DORSAL AFFRICATES
    tʃ / dʒ /
    ; NON-DORSAL FRICATIVES
    f / v / θ / ð / s / z / ʃ / ʒ /
    ; NON-DORSAL NASALS
    m ɱ / n /
    ; NON-DORSAL LIQUIDS
    l
    ; NON-DORSAL RHOTIC LIQUIDS
    ɹ 
    ; NON-DORSAL SYLLABIC CONSONANTS
    m̩ / n̩ / l̩ / ɹ̩
    ; NON-DORSAL GLIDES
    w
]

*PROTO
  ; -- Devoicing, all our z's become s's
  [+ voice - continuant]>[- voice]/._.
  ; -- Reduction of schwa
  ə>0/._.
|Gif Lang

*PROTO
  ; -- Ejectivization, all our pits become pit's
  [+ spreadGlottis - continuant]>[+ constrictedGlottis - spreadGlottis]/._[+ constrictedGlottis]
  [+ spreadGlottis - continuant]>[+ constrictedGlottis - spreadGlottis]/[+ constrictedGlottis]_.
  [+ constrictedGlottis]>0/[+ constrictedGlottis - continuant]_.
  [+ constrictedGlottis]>0/._[+ constrictedGlottis - continuant]
|Jif Lang
`