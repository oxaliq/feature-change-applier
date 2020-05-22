const moo = require('moo');

const lexer = moo.states({
  main: {
    comment:              /;.*$/,
    star:          { match: /\*/, push: 'epoch' },
    slash:                { match: /\//, push: 'lexicon' },
    // change so that identifiers are always upper, keywords are always lower, phones are always lower
    'kwSet':             { match: 'set', type: moo.keywords({ 'kwSet': 'set '}), push: 'setDefinition'},
    identifier:           { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/, },
    openBracket:          { match: /\[/, push: 'feature' },
    whiteSpace:           { match: /\s+/, lineBreaks: true },
    newLine:              { match: /\n+/, lineBreaks: true }
  },
  
  epoch: {
    identifier:           { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/, push: 'rule' },
    openParen:            { match: /\(/, push: 'ruleDefinition' },
    pipe:                 { match: /\|/, pop: true },
    greaterThan:          /\>/,
    arrow:                /\-\>/,
    hash:                 /#/,
    slash:                /\//,
    dot:                  /\./,
    underscore:           /\_/,
    newLine:              { match: /\n/, lineBreaks: true }
  },
  
  ruleDefinition: {
    doubleTick:           { match: /``/, push: 'ruleName' },
    singleTick:           { match: /`/, push: 'ruleDescription' },
    // push rule
    closeParen:           { match: /\)/, pop: true },
    newLine:              { match: /\n/, lineBreaks: true }
  },

  ruleName: {
    ruleName:             { match: /.+(?=``)/ },
    doubleTick:           { match: /``/, pop: true }
  },

  ruleDescription: {
    ruleDescription:      { match: /.+(?=`)/ },
    singleTick:           { match: /`/, pop: true }
  },
  
  rule: {
    openSquareBracket:    { match: /\[/, push: 'ruleFeature' },
    // whiteSpace:           { match: /\s/ },
    newLine:              { match: /\n/, pop: true, lineBreaks: true }
  },
  
  ruleFeature: {
    ruleFeature:          { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/ },
    closeBracket:         { match: /\]/, pop: true },
    newLine:              { match: /\n/, lineBreaks: true }
  },
  
  lexicon: {
    slash:                { match: /\//, pop: true },
    newLine:              { match: /\n/, lineBreaks: true }
  },
  
  feature: {
    closeBracket:         { match: /\]/, pop: true },
    positiveAssignment:   /\+=/,
    negativeAssignment:   /\-=/,
    newLine:              { match: /\n/, lineBreaks: true }
  },
  
  setDefinition: {
    comment:              /;.*$/,
    setIdentifier:        { match: /[A-Z]+[A-Z_]*/ },
    openCurlyBracket:     { match: /\{/, push: 'setOperation' },
    equal:                /=/,
    openSquareBracket:    /\[/,
    phone:                /[\u00c0-\u03FFa-z]+/,
    closeSquareBracket:   { match: /\]/ },
    comma:                { match: /,/, push: 'commaOperation' },
    whiteSpace:           { match: /[\t ]+/ },
    newLine:              { match: /\n/, pop: true, lineBreaks: true },
  },
    
  setOperation: {
    closeCurlyBracket:    { match: /\}/, pop: true },
    // ! restrict identifiers
    keyword:              { match: ['not', 'and', 'or', 'nor', 'in', 'yield', 'concat', 'dissoc'], type: moo.keywords({
      'kwSetNot':       'not' ,
      'kwSetAnd':       'and' ,
      'kwSetOr':        'or' ,
      'kwSetNor':       'nor' ,
      'kwSetIn':        'in' ,
      'kwSetYield':     'yield' ,
      'kwSetConcat':    'concat',
      'kwSetDissoc':    'dissoc'
      })
    },
    identifier:           /[A-Z]+[A-Z_]+/,
    whiteSpace:           { match: /\s+/, lineBreaks: true },
    openSquareBracket:    /\]/,
    closeSquareBracket:   /\[/,
    identifier:           /[A-Z]+[A-Z_]*/,
    phone:                /[\u00c0-\u03FFa-z]+/,
  },
  
  commaOperation: {
    // if comma is detected during a definition, the commaOperation consumes all white space and pops back to definition
    // this prevents popping back to main
    comment:              /\s*;.*$/,
    whiteSpace:           { match: /\s+/, lineBreaks: true, pop: true },
    newLine:              { match: /\n/, lineBreaks: true, pop: true }
  }
  
});

module.exports = {lexer};