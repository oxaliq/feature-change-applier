import { stateReducer } from './reducer';
import { initState } from './reducer.init';
import { tokenize } from './reducer.latl';

describe('LATL', () => {
  it('returns state unaltered with no action body', () => {
    const state = initState();
    const action = {
      type: 'SET_LATL',
      value: ''
    }
    const returnedState = stateReducer(state, action)
    expect(returnedState).toStrictEqual(state);
  })

  it('returns tokens from well-formed latl epoch definition', () => {
    const tokens = tokenize(epochDefinitionLatl);
    expect(tokens).toStrictEqual(tokenizedEpoch)
  });
  
  it('returns tokens from well-formed latl feature definition', () => {
    const tokens = tokenize(featureDefinitionLatl);
    expect(tokens).toStrictEqual(tokenizedFeature);
  })

  it('returns tokens from well-formed latl lexicon definition', () => {
    const tokens = tokenize(lexiconDefinitionLatl);
    expect(tokens).toStrictEqual(tokenizedLexicon);
  })
})
const epochDefinitionLatl = `
*PROTO
[+ FEATURE]>[- FEATURE]/._.
n>m/#_.
|CHILD
`

const tokenizedEpoch = [ 
  '*', 'PROTO', 
  '[', '+', 'FEATURE', ']', '>', '[', '-', 'FEATURE', ']', '/', '.', '_', '.',
  'n', '>', 'm', '/', '#', '_', '.',
  '|', 'CHILD'
]

const featureDefinitionLatl = `
[+ PLOSIVE] = kp / p / b / d / t / g / k
[- PLOSIVE] = m / n / s / z
[SONORANT 
  += m / n
  -= s / z / kp / p / b / d / t / g / k
]
`

const tokenizedFeature = [
  '[', '+', 'PLOSIVE', ']', '=', 'kp', '/', 'p', '/', 'b', '/', 'd', '/', 't', '/', 'g', '/', 'k',
  '[', '-', 'PLOSIVE', ']', '=', 'm', '/', 'n', '/', 's', '/', 'z',
  '[', 'SONORANT',
    '+=', 'm', '/', 'n',
    '-=', 's', '/', 'z', '/', 'kp', '/', 'p', '/', 'b', '/', 'd', '/', 't', '/', 'g', '/', 'k',
  ']'
]

const lexiconDefinitionLatl = `
/PROTO
  kpn
  sm
/
`

const tokenizedLexicon = [
  '/', 'PROTO',
    'kpn',
    'sm',
  '/'
]