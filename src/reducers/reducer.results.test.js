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
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Insert '>' operator between target and result");
  })

  it('rule with too many ">" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n>/_' ] }
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Too many '>' operators");
  })

  it('rule without "/" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n_' ] }
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Insert '/' operator between change and environment");
  })

  it('rule with too many "/" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/_/' ] }
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Too many '/' operators");
  })

  it('rule without "_" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/' ] }
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Insert '_' operator in environment");
  })

  it('rule with too many "_" returns helpful error message', () => {
    const { phones } = initState();
    const epoch = { name: 'error epoch', changes: [ 't>n/__' ] }
    expect(decomposeRules(epoch, phones)).toEqual("Error in line 1: Too many '_' operators");
  })

  it('expect transform lexeme to apply rule to lexeme', () => {
    const lexemeBundle = getlexemeBundle();
    const resultsLexeme = [...lexemeBundle]
    resultsLexeme[2] = lexemeBundle[1]
    const rule = getRule();
    expect(transformLexeme(lexemeBundle, rule, initState().features)).toEqual(resultsLexeme)
  })

  it('results returned from first sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(1)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch 1',
        lexicon: [
          'anna', 'anat', 'anət', 'anna', 'tan', 'ənna'
        ]
      }
    ]);
  });
  
  it('results returned through second sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(2)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch 1',
        lexicon: [
          'annɯ', 'anat', 'anət', 'annɯ', 'tan', 'ənnɯ'
        ]
      }
    ]);
  });

  it('results returned through third sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(3)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch 1',
        lexicon: [
          'annɯ', 'anat', 'ant', 'annɯ', 'tan', 'nnɯ'
        ]
      }
    ]);
  });

  it('results returned through fourth sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(4)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch 1',
        lexicon: [
          'annɯ', 'anat', 'ant', 'annɯ', 'tʰan', 'nnɯ'
        ]
      }
    ]);
  });

  it('results returned through fifth sound change rule', () => {
    const action = {type: 'RUN'};
    state = initState(5)
    expect(stateReducer(state, action).results).toEqual([
      {
        pass: 'epoch 1',
        lexicon: [
          'annu', 'anat', 'ant', 'annu', 'tʰan', 'nnu'
        ]
      }
    ]);
  });


  // it('results returned through sixth sound change rule', () => {
  //   const action = {type: 'RUN'};
  //   state = initState(5)
  //   expect(stateReducer(state, action).results).toEqual([
  //     {
  //       pass: 'epoch 1',
  //       lexicon: [
  //         'anunu', 'anat', 'ant', 'anunu', 'tʰan', 'nunu'
  //       ]
  //     }
  //   ]);
  // });

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