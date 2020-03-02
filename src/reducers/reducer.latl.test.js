import { stateReducer } from './reducer';
import { initState } from './reducer.init';
import { tokenize, buildTree, parseLatl } from './reducer.latl';

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
  });

  it('returns tokens from well-formed latl lexicon definition', () => {
    const tokens = tokenize(lexiconDefinitionLatl);
    expect(tokens).toStrictEqual(tokenizedLexicon);
  });
  
  it('returns tokens from well-formed latl epoch, feature, and lexicon definitions', () => {
    const latl = epochDefinitionLatl + '\n' + featureDefinitionLatl + '\n' + lexiconDefinitionLatl;
    const tokens = tokenize(latl);
    const lineBreaks = [{ type: 'lineBreak', value: '' },{ type: 'lineBreak', value: '' },{ type: 'lineBreak', value: '' }]
    const tokenizedLatl = [...tokenizedEpoch, ...lineBreaks, ...tokenizedFeature, ...lineBreaks, ...tokenizedLexicon];
    expect(tokens).toStrictEqual(tokenizedLatl);
  });

  it('returns AST from well-formed epoch tokens', () => {
    const tree = buildTree(tokenizedEpoch);
    expect(tree).toStrictEqual(treeEpoch);
  })

  it('returns run from well-formed epoch latl', () => {
    const state = initState();
    const setAction = {
      type: 'SET_LATL',
      value: epochDefinitionLatl
    }
    const latlState = stateReducer(state, setAction);
    const parseState = parseLatl(latlState, {})
    expect(parseState).toStrictEqual(epochState);
    parseState.lexicon[0].epoch = 'PROTO'
    const runState = stateReducer(parseState, {type: 'RUN', value:{}})
    console.log(runState)
  })

})
const epochDefinitionLatl = `
; comment
*PROTO
[+ FEATURE]>[- FEATURE]/._.
n>m/#_.
|CHILD
`

const tokenizedEpoch = [ 
  { type: "semicolon", value: "; comment" },
  { type: "star", value: "*" }, { type: "referent", value: "PROTO" }, { type: 'lineBreak', value: '' },
    { type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "referent", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "greaterThan", value: ">" }, { type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "referent", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "slash", value: "/" }, { type: "dot", value: "." }, 
      { type: "underscore", value: "_" }, { type: "dot", value: "." }, { type: 'lineBreak', value: '' },
    { type: "referent", value: "n" },
      { type: "greaterThan", value: ">" }, { type: "referent", value: "m" },
      { type: "slash", value: "/" }, { type: "hash", value: "#" },
      { type: "underscore", value: "_" }, { type: "dot", value: "." }, { type: 'lineBreak', value: '' },
  { type: "pipe", value: "|" }, { type: "referent", value: "CHILD" }
]

const treeEpoch = {
  epochs: [
    {
      parent: 'PROTO',
      name: 'CHILD',
      index: 0,
      changes: [
        '[+FEATURE]>[-FEATURE]/._.',
        'n>m/#_.'
      ]
    }
  ]
}

const epochState = {
  ...initState(),
  epochs: treeEpoch.epochs,
  latl: epochDefinitionLatl
}

const featureDefinitionLatl = `
[+ PLOSIVE] = kp / p / b / d / t / g / k
[- PLOSIVE] = m / n / s / z
[SONORANT 
  += m / n
  -= s / z / kp / p / b / d / t / g / k
]
`

const tokenizedFeature = [
  { type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "referent", value: "PLOSIVE" }, { type: "closeBracket", value: "]" },
    { type: "equal", value: "=" }, { type: "referent", value: "kp" }, { type: "slash", value: "/" }, { type: "referent", value: "p" }, { type: "slash", value: "/" }, { type: "referent", value: "b" }, { type: "slash", value: "/" }, { type: "referent", value: "d" }, { type: "slash", value: "/" }, { type: "referent", value: "t" }, { type: "slash", value: "/" }, { type: "referent", value: "g" }, { type: "slash", value: "/" }, { type: "referent", value: "k" }, { type: 'lineBreak', value: '' },
  { type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "referent", value: "PLOSIVE" }, { type: "closeBracket", value: "]" },
    { type: "equal", value: "=" }, { type: "referent", value: "m" }, { type: "slash", value: "/" }, { type: "referent", value: "n" }, { type: "slash", value: "/" }, { type: "referent", value: "s" }, { type: "slash", value: "/" }, { type: "referent", value: "z" }, { type: 'lineBreak', value: '' },
  { type: "openBracket", value: "[" }, { type: "referent", value: "SONORANT" }, { type: 'lineBreak', value: '' },
    { type: "positiveAssignment", value: "+=" },
      { type: "referent", value: "m" }, { type: "slash", value: "/" }, { type: "referent", value: "n" }, { type: 'lineBreak', value: '' },
    { type: "negativeAssignment", value: "-=" }, { type: "referent", value: "s" }, { type: "slash", value: "/" }, { type: "referent", value: "z" }, { type: "slash", value: "/" }, { type: "referent", value: "kp" }, { type: "slash", value: "/" }, { type: "referent", value: "p" }, { type: "slash", value: "/" }, { type: "referent", value: "b" }, { type: "slash", value: "/" }, { type: "referent", value: "d" }, { type: "slash", value: "/" }, { type: "referent", value: "t" }, { type: "slash", value: "/" }, { type: "referent", value: "g" }, { type: "slash", value: "/" }, { type: "referent", value: "k" }, { type: 'lineBreak', value: '' },
    { type: "closeBracket", value: "]" },
]

const lexiconDefinitionLatl = `
/PROTO
  kpn
  sm
/
`

const tokenizedLexicon = [
  { type: "slash", value: "/" }, { type: "referent", value: "PROTO" }, { type: 'lineBreak', value: '' },
    { type: "referent", value: "kpn" }, { type: 'lineBreak', value: '' },
    { type: "referent", value: "sm" }, { type: 'lineBreak', value: '' },
  { type: "slash", value: "/" }
]