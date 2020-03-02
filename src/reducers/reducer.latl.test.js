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
  });

  it('returns tokens from well-formed latl lexicon definition', () => {
    const tokens = tokenize(lexiconDefinitionLatl);
    expect(tokens).toStrictEqual(tokenizedLexicon);
  });
  
  it('returns tokens from well-formed latl epoch, feature, and lexicon definitions', () => {
    const latl = epochDefinitionLatl + '\n' + featureDefinitionLatl + '\n' + lexiconDefinitionLatl;
    const tokens = tokenize(latl);
    const tokenizedLatl = [...tokenizedEpoch, ...tokenizedFeature, ...tokenizedLexicon];
    expect(tokens).toStrictEqual(tokenizedLatl);
  });

})
const epochDefinitionLatl = `
*PROTO
[+ FEATURE]>[- FEATURE]/._.
n>m/#_.
|CHILD
`

const tokenizedEpoch = [ 
  { type: "star", value: "*" }, { type: "variable", value: "PROTO" },
    { type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "variable", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "greaterThan", value: ">" }, { type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "variable", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "slash", value: "/" }, { type: "dot", value: "." }, 
      { type: "loDash", value: "_" }, { type: "dot", value: "." },
    { type: "variable", value: "n" },
      { type: "greaterThan", value: ">" }, { type: "variable", value: "m" },
      { type: "slash", value: "/" }, { type: "hash", value: "#" },
      { type: "loDash", value: "_" }, { type: "dot", value: "." },
  { type: "pipe", value: "|" }, { type: "variable", value: "CHILD" }
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
  { type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "variable", value: "PLOSIVE" }, { type: "closeBracket", value: "]" },
    { type: "equal", value: "=" }, { type: "variable", value: "kp" }, { type: "slash", value: "/" }, { type: "variable", value: "p" }, { type: "slash", value: "/" }, { type: "variable", value: "b" }, { type: "slash", value: "/" }, { type: "variable", value: "d" }, { type: "slash", value: "/" }, { type: "variable", value: "t" }, { type: "slash", value: "/" }, { type: "variable", value: "g" }, { type: "slash", value: "/" }, { type: "variable", value: "k" },
  { type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "variable", value: "PLOSIVE" }, { type: "closeBracket", value: "]" },
    { type: "equal", value: "=" }, { type: "variable", value: "m" }, { type: "slash", value: "/" }, { type: "variable", value: "n" }, { type: "slash", value: "/" }, { type: "variable", value: "s" }, { type: "slash", value: "/" }, { type: "variable", value: "z" },
  { type: "openBracket", value: "[" }, { type: "variable", value: "SONORANT" },
    { type: "positiveAssignment", value: "+=" },
      { type: "variable", value: "m" }, { type: "slash", value: "/" }, { type: "variable", value: "n" },
    { type: "negativeAssignment", value: "-=" }, { type: "variable", value: "s" }, { type: "slash", value: "/" }, { type: "variable", value: "z" }, { type: "slash", value: "/" }, { type: "variable", value: "kp" }, { type: "slash", value: "/" }, { type: "variable", value: "p" }, { type: "slash", value: "/" }, { type: "variable", value: "b" }, { type: "slash", value: "/" }, { type: "variable", value: "d" }, { type: "slash", value: "/" }, { type: "variable", value: "t" }, { type: "slash", value: "/" }, { type: "variable", value: "g" }, { type: "slash", value: "/" }, { type: "variable", value: "k" },
    { type: "closeBracket", value: "]" },
]

const lexiconDefinitionLatl = `
/PROTO
  kpn
  sm
/
`

const tokenizedLexicon = [
  { type: "slash", value: "/" }, { type: "variable", value: "PROTO" },
    { type: "variable", value: "kpn" },
    { type: "variable", value: "sm" },
  { type: "slash", value: "/" }
]