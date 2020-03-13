const moo = require('moo');

export const lexer = moo.states({
  main: {
    comment:              /;.*/,
    epochParent:          { match: /\*/, push: 'epoch' },
    slash:                { match: /\//, push: 'lexicon' },
    // change so that identifiers are always upper, keywords are always lower, phones are always lower
    identifier:           { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/, type: moo.keywords({
      'kw-set': { match: 'set', push: 'setDefinition' }
    })},
    openBracket:          { match: /\[/, push: 'feature' },
    space:                { match: /\s+/, lineBreaks: true }
  },
  
  epoch: {
    identifier:           { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/, push: 'rule' },
    pipe:                 { match: /\|/, pop: true },
    greaterThan:          /\>/,
    arrow:                /\-\>/,
    hash:                 /#/,
    slash:                /\//,
    dot:                  /\./,
    underscore:           /\_/,
  },

  rule: {
    openSquareBracket:    { match: /\[/, push: 'ruleFeature' },

  },

  ruleFeature: {
    ruleFeature:          { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/ },
    closeBracket:         { match: /\]/, pop: true }
  },

  lexicon: {
    slash:                { match: /\//, pop: true },
  },

  feature: {
    closeBracket:         { match: /\]/, pop: true },
    positiveAssignment:   /\+=/,
    negativeAssignment:   /\-=/,
  },

  setDefinition: {
    openCurlyBracket:     /\{/,
    closeCurlyBracket:    /\}/,
    openSquareBracket:    /\[/,
    closeSquareBracket:   /\]/
  }
});

// ['semicolon', ';.*\n'],
// [`star`, `\\*`],

// ['pipe', `\\|`],
// ['openBracket', `\\[`],
// ['closeBracket', `\\]`],
// ['positiveAssignment', `\\+=`],
// ['negativeAssignment', `\\-=`],
// ['plus', `\\+`],
// ['minus', `\\-`],
// ['greaterThan', `\\>`],
// ['hash', `#`],
// ['slash', `\/`],
// ['dot', `\\.`],
// ['underscore', `\\_`],

// [`identifier`, `[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*`],

// [`phone`, `[\u00c0-\u03FFA-Za-z0]+`],
// ['equal', `=`],
// [`lineBreak`, `\\n`],
// [`whiteSpace`, `\\s+`]