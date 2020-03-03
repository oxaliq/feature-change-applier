import { stateReducer } from './reducer';
import { initState } from './reducer.init';
import { decomposeRules, transformLexeme } from './reducer.results';

describe('Results', () => {
  let state = {};
  beforeEach(()=> {
    state = {};
  })

  it('results returned unaltered', () => {
    const action = {type: ''};
    expect(stateReducer(state, action)).toBe(state);
  });

  it('rules decomposed properly', () => {
    const { epochs, phones } = initState(1);
    const result = getResult();
    expect(decomposeRules(epochs[0], phones)).toStrictEqual(result);
  });

  it('rule without ">" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't/n/_' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Insert '>' operator between target and result"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule with too many ">" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n>/_' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Too many '>' operators"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule without "/" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n_' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Insert '/' operator between change and environment"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule with too many "/" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/_/' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Too many '/' operators"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule without "_" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Insert '_' operator in environment"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule with too many "_" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/__' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Too many '_' operators"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })
  
  it('rule with incorrect feature syntax returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ '[+ occlusive - nasal = obstruent]>n/_' ] }
    const errorMessage = {epoch: 'error epoch', error: "Error in line 1: Unknown token '='"};
    let receivedError;
    try {
      decomposeRules(epoch, phones)
    }
    catch (err) {
      receivedError=err;
    }
    expect(receivedError).toStrictEqual(errorMessage);
  })

  it('expect transform lexeme to apply rule to lexeme', () => {
    const lexemeBundle = getlexemeBundle();
    const resultsLexeme = [...lexemeBundle]
    resultsLexeme[2] = lexemeBundle[1]
    const rule = getRule();
    expect(transformLexeme(lexemeBundle, rule, initState().features)).toEqual(resultsLexeme)
  })

  it('results returned from first sound change rule (feature matching)', () => {
    const action = {type: 'RUN'};
    state = initState(1)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'anna', 'anat', 'anət', 'anna', 'tan', 'ənna'
        ]
      }
    ]);
  });
  
  it('results returned through second sound change rule (phoneme matching)', () => {
    const action = {type: 'RUN'};
    state = initState(2)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annɯ', 'anat', 'anət', 'annɯ', 'tan', 'ənnɯ'
        ]
      }
    ]);
  });

  it('results returned through third sound change rule (phoneme dropping)', () => {
    const action = {type: 'RUN'};
    state = initState(3)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annɯ', 'anat', 'ant', 'annɯ', 'tan', 'nnɯ'
        ]
      }
    ]);
  });

  it('results returned through fourth sound change rule (lexeme initial environment)', () => {
    const action = {type: 'RUN'};
    state = initState(4)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annɯ', 'anat', 'ant', 'annɯ', 'tʰan', 'nnɯ'
        ]
      }
    ]);
  });

  it('results returned through fifth sound change rule (lexeme final environment)', () => {
    const action = {type: 'RUN'};
    state = initState(5)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annu', 'anat', 'ant', 'annu', 'tʰan', 'nnu'
        ]
      }
    ]);
  });

  // it('results returned through sixth sound change rule (multi-phoneme target)', () => {
  //   const action = {type: 'RUN'};
  //   state = initState(6)
  //   expect(stateReducer(state, action).results).toEqual([
  //     {
  //       pass: 'epoch-1',
  //       lexicon: [
  //         'annu', 'anta', 'ant', 'annu', 'tʰan', 'nnu'
  //       ]
  //     }
  //   ]);
  // });

  it('results returned for multiple epochs without parent epoch', () => {
    const action = {type: 'RUN'};
    state = initState(5);
    const newEpoch = {
      name: 'epoch-2',
      changes: [
        '[+ sonorant ]>0/#_.',
        'n>0/#_n'
      ]
    }
    state.epochs = [ ...state.epochs, newEpoch ]
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annu', 'anat', 'ant', 'annu', 'tʰan', 'nnu'
        ]
      },
      {
        pass: 'epoch-2',
        lexicon: [
          'nta', 'nat', 'nət', 'na', 'tan', 'nta'
        ]
      }
    ])
  })

  it('results returned for multiple epochs with parent epoch', () => {
    const action = {type: 'RUN'};
    state = initState(5);
    const newEpoch = {
      name: 'epoch-2',
      parent: 'epoch-1',
      changes: [
        '[+ sonorant ]>0/#_.'
      ]
    }
    state.epochs = [ ...state.epochs, newEpoch ]
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch-1',
        lexicon: [
          'annu', 'anat', 'ant', 'annu', 'tʰan', 'nnu'
        ]
      },
      {
        pass: 'epoch-2',
        parent: 'epoch-1',
        lexicon: [
          'nnu', 'nat', 'nt', 'nnu', 'tʰan', 'nu'
        ]
      }
    ])
  })
});


const getlexemeBundle = () => ([
  {
    grapheme: 'a',
    features: {
      sonorant: true,
      back: true,
      low: true,
      high: false,
      rounded: false
    }
  },
  {
    grapheme: 'n',
    features: { sonorant: true, nasal: true, occlusive: true, coronal: true }
  },
  {
    grapheme: 't',
    features: { occlusive: true, coronal: true, obstruent: true, nasal: false }
  },
  {
    grapheme: 'a',
    features: {
      sonorant: true,
      back: true,
      low: true,
      high: false,
      rounded: false
    }
  }
])

const getRule = () => ({
  environment: { 
    pre: [ { sonorant: true, nasal: true, occlusive: true, coronal: true } ],
    position: [ { occlusive: true, nasal: false } ],
    post: [] 
  },
  newFeatures: [ { occlusive: true, nasal: true } ]
})

const getResult = () => ([
  {
    environment: {
      pre: [
        {
          sonorant: true, nasal: true, occlusive: true, coronal: true
        }
      ],
      position: [
        {occlusive: true, nasal: false}
      ],
      post: [],
    },
    newFeatures: [{occlusive: true, nasal: true}]
  }
]);