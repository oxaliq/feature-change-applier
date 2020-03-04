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

  it('returns AST from well-formed feature tokens', () => {
    const tree = buildTree(tokenizedFeature);
    expect(tree).toStrictEqual(treeFeature);
  })

  it('returns AST from well-formed lexicon tokens', () => {
    const tree = buildTree(tokenizedLexicon);
    expect(tree).toStrictEqual(treeLexicon);
  })

  it('parse returns state from well-formed feature latl', () => {
    const state = initState();
    const setAction = {
      type: 'SET_LATL',
      value: featureDefinitionLatl
    }
    const latlState = stateReducer(state, setAction);
    const parseState = parseLatl(latlState, {});
    expect(parseState).toStrictEqual(featureState)
  })

  it('returns run from well-formed epoch latl', () => {
    const state = initState();
    const setAction = {
      type: 'SET_LATL',
      value: runEpochLatl
    }
    const latlState = stateReducer(state, setAction);
    const parseState = parseLatl(latlState, {})
    // expect(parseState).toStrictEqual(epochState);
    parseState.lexicon[0].epoch = 'PROTO'
    const runState = stateReducer(parseState, {type: 'RUN', value:{}})
    expect(runState).toStrictEqual({...runState, results: runEpochResults})
  })

  it('returns state from well-formed lexicon latl', () => {
    const state = initState();
    const setAction = {
      type: 'SET_LATL',
      value: lexiconDefinitionLatl
    }
    const latlState = stateReducer(state, setAction);
    const parseState = parseLatl(latlState, {});
    expect(parseState).toStrictEqual(lexiconState)

  })

  it('returns state from well formed latl', () => {
    const state = initState();
    const setAction = {
      type: 'SET_LATL',
      value: totalLatl
    }
    const latlState = stateReducer(state, setAction);
    const parseState = parseLatl(latlState, {});
    expect(parseState).toStrictEqual(totalLatlState)
  })

})
const epochDefinitionLatl = `
; comment
*PROTO
  [+ FEATURE]>[- FEATURE]/._.
  n>m/#_.
|CHILD
`

const runEpochLatl = `
; comment
*PROTO
  a>u/._.
|epoch-1
`

const runEpochResults = [
  {
    pass: 'epoch-1',
    parent: 'PROTO',
    lexicon: [ 'untu', 'unut', 'unət', 'unnu', 'tun', 'əntu' ]
  }
]

const tokenizedEpoch = [ 
  { type: "semicolon", value: "; comment" },
  { type: "star", value: "*" }, { type: "referent", value: "PROTO" }, { type: 'lineBreak', value: '' }, { type: "whiteSpace", value: "" },
    { type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "greaterThan", value: ">" }, { type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "FEATURE" }, { type: "closeBracket", value: "]" }, 
      { type: "slash", value: "/" }, { type: "dot", value: "." }, 
      { type: "underscore", value: "_" }, { type: "dot", value: "." }, { type: 'lineBreak', value: '' }, { type: "whiteSpace", value: "" },
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
        '[+ FEATURE]>[- FEATURE]/._.',
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
[+ PLOSIVE] = kp/p/b/d/t/g/k
[- PLOSIVE] = m/n/s/z
[SONORANT
  += m/n
  -= s/z/kp/p/b/d/t/g/k
]
`

const tokenizedFeature = [
  {type: "openBracket", value: "[" }, { type: "plus", value: "+" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "PLOSIVE" }, { type: "closeBracket", value: "]" }, { type: "whiteSpace", value: "" },
    { type: "equal", value: "=" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "kp" }, { type: "slash", value: "/" }, { type: "referent", value: "p" }, { type: "slash", value: "/" }, { type: "referent", value: "b" }, { type: "slash", value: "/" }, { type: "referent", value: "d" }, { type: "slash", value: "/" }, { type: "referent", value: "t" }, { type: "slash", value: "/" }, { type: "referent", value: "g" }, { type: "slash", value: "/" }, { type: "referent", value: "k" }, { type: 'lineBreak', value: '' },
  {type: "openBracket", value: "[" }, { type: "minus", value: "-" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "PLOSIVE" }, { type: "closeBracket", value: "]" }, { type: "whiteSpace", value: "" },
    { type: "equal", value: "=" }, { type: "whiteSpace", value: "" }, { type: "referent", value: "m" }, { type: "slash", value: "/" }, { type: "referent", value: "n" }, { type: "slash", value: "/" }, { type: "referent", value: "s" }, { type: "slash", value: "/" }, { type: "referent", value: "z" }, { type: 'lineBreak', value: '' },
  {type: "openBracket", value: "[" }, { type: "referent", value: "SONORANT" }, { type: 'lineBreak', value: '' },
    { type: "whiteSpace", value: "" }, { type: "positiveAssignment", value: "+=" }, { type: "whiteSpace", value: "" },
      { type: "referent", value: "m" }, { type: "slash", value: "/" }, { type: "referent", value: "n" }, { type: 'lineBreak', value: '' },
    { type: "whiteSpace", value: "" }, { type: "negativeAssignment", value: "-=" }, { type: "whiteSpace", value: "" },
      { type: "referent", value: "s" }, { type: "slash", value: "/" }, { type: "referent", value: "z" }, { type: "slash", value: "/" }, { type: "referent", value: "kp" }, { type: "slash", value: "/" }, { type: "referent", value: "p" }, { type: "slash", value: "/" }, { type: "referent", value: "b" }, { type: "slash", value: "/" }, { type: "referent", value: "d" }, { type: "slash", value: "/" }, { type: "referent", value: "t" }, { type: "slash", value: "/" }, { type: "referent", value: "g" }, { type: "slash", value: "/" }, { type: "referent", value: "k" }, { type: 'lineBreak', value: '' },
    { type: "closeBracket", value: "]" },
]

const treeFeature = { features: [
  {
    feature: 'PLOSIVE',
    positivePhones: ['kp', 'p', 'b', 'd', 't', 'g', 'k'],
    negativePhones: ['m', 'n', 's', 'z']
  },
  {
    feature: 'SONORANT',
    positivePhones: ['m', 'n'],
    negativePhones: ['s' ,'z' ,'kp' ,'p' ,'b' ,'d' ,'t' ,'g' ,'k']
  }
]}

const featureState = {
  ...initState(),
  features: {
    PLOSIVE: {
      negative:  [
        {
          features: {
            PLOSIVE: false,
            SONORANT: true,
      },
        grapheme: "m",
    },
     {
          features: {
            PLOSIVE: false,
          SONORANT: true,
      },
        grapheme: "n",
    },
     {
          features: {
            PLOSIVE: false,
          SONORANT: false,
      },
        grapheme: "s",
    },
     {
          features: {
            PLOSIVE: false,
          SONORANT: false,
      },
        grapheme: "z",
    },
  ],
    positive:  [
       {
          features: {
            PLOSIVE: true,
      },
        grapheme: "kp",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "p",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "b",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "d",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "t",
        ʰ: {
            features: {},
          grapheme: "tʰ",
      },
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "g",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "k",
        p: {
            features: {
              SONORANT: false,
        },
          grapheme: "kp",
      },
    },
  ],
},
  SONORANT: {
      negative:  [
       {
          features: {
            PLOSIVE: false,
          SONORANT: false,
      },
        grapheme: "s",
    },
     {
          features: {
            PLOSIVE: false,
          SONORANT: false,
      },
        grapheme: "z",
    },
     {
          features: {
            SONORANT: false,
      },
        grapheme: "kp",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "p",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "b",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "d",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "t",
        ʰ: {
            features: {},
          grapheme: "tʰ",
      },
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "g",
    },
     {
          features: {
            PLOSIVE: true,
          SONORANT: false,
      },
        grapheme: "k",
        p: {
            features: {
              SONORANT: false,
        },
          grapheme: "kp",
      },
    },
  ],
    positive:  [
       {
          features: {
            PLOSIVE: false,
          SONORANT: true,
      },
        grapheme: "m",
    },
     {
          features: {
            PLOSIVE: false,
          SONORANT: true,
      },
        grapheme: "n",
    },
  ],
},  },
  parseResults: 'latl parsed successfully',
  latl: featureDefinitionLatl,
  phones: {
    a: {
        features: {},
      grapheme: "a",
  },
    b: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "b",
  },
    d: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "d",
  },
    g: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "g",
  },
    k: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "k",
      p: {
          features: {
            SONORANT: false,
      },
        grapheme: "kp",
    },
  },
    m: {
        features: {
          PLOSIVE: false,
        SONORANT: true,
    },
      grapheme: "m",
  },
    n: {
        features: {
          PLOSIVE: false,
        SONORANT: true,
    },
      grapheme: "n",
  },
    p: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "p",
  },
    s: {
        features: {
          PLOSIVE: false,
        SONORANT: false,
    },
      grapheme: "s",
  },
    t: {
        features: {
          PLOSIVE: true,
        SONORANT: false,
    },
      grapheme: "t",
      ʰ: {
          features: {},
        grapheme: "tʰ",
    },
  },
    u: {
        features: {},
      grapheme: "u",
  },
    z: {
        features: {
          PLOSIVE: false,
        SONORANT: false,
    },
      grapheme: "z",
  },
    ə: {
        features: {},
      grapheme: "ə",
  },
    ɯ: {
        features: {},
      grapheme: "ɯ",
  },
  }
}

const lexiconDefinitionLatl = `
/PROTO
  kpn
  sm
/
`

const tokenizedLexicon = [
  { type: "slash", value: "/" }, { type: "referent", value: "PROTO" }, { type: 'lineBreak', value: '' },
    { type: "whiteSpace", value:"" }, { type: "referent", value: "kpn" }, { type: 'lineBreak', value: '' },
    { type: "whiteSpace", value:"" }, { type: "referent", value: "sm" }, { type: 'lineBreak', value: '' },
  { type: "slash", value: "/" }
]

const treeLexicon = {lexicon: [{epoch: "PROTO", value: ["kpn", "sm"]}]};

const lexiconState = {
  ...initState(),
  latl: lexiconDefinitionLatl,
  lexicon: [
    { lexeme: 'kpn', epoch: 'PROTO'},
    { lexeme: 'sm', epoch: 'PROTO'}
  ],
  parseResults: 'latl parsed successfully'
}

const totalLatl = `${epochDefinitionLatl}\n\n${featureDefinitionLatl}\n\n${lexiconDefinitionLatl}`

const totalLatlState = {
  ...initState(),
  latl: totalLatl,
  phonemes: {},
  features: featureState.features,
  epochs: treeEpoch.epochs,
  lexicon: lexiconState.lexicon,
  parseResults: 'latl parsed successfully'
}