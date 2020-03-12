const moo = require('moo');

export const lexer = moo.states({
  main: {
    comment:              /;.*/,
    star:                 { match: /\*/, push: 'epoch' },
    slash:                { match: /\//, push: 'lexicon' },
    identifier:           { match: /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/, type: moo.keywords({
      'kw-set': 'set'
    })},
    openBracket:          { match: /\[/, push: 'feature' },
    space:                { match: /\s+/, lineBreaks: true }
  },

  epoch: {
    identifier:           /[A-Za-z]+[\u00c0-\u03FFA-Za-z0-9\\-\\_]*/,
    pipe:                 { match: /\|/, pop: true },
    greaterThan:          /\>/,
    arrow:                /\-\>/,
    hash:                 /#/,
    slash:                /\//,
    dot:                  /\./,
    underscore:           /\_/,
  },

  lexicon: {
    slash:                { match: /\//, pop: true },
  },

  feature: {
    closeBracket:         { match: /\]/, pop: true },
    positiveAssignment:   /\+=/,
    negativeAssignment:   /\-=/,
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