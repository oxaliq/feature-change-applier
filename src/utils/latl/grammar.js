// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const { lexer } = require('./lexer.js');
  const getTerminal = d => d ? d[0] : null;
  const getAll = d => d.map((item, i) => ({[i]: item}));
  const flag = token => d => d.map(item => ({[token]: item}))
  const clearNull = d => d.filter(t => !!t);
  const flagIndex = d => d.map((item, i) => ({[i]: item}))
  const remove = _ => null;
  const append = d => d.join('');
  const constructSet =  d => d.reduce((acc, t) => { 
    if (t && t.type === 'setIdentifier')  acc.push({set: t})
    if (t && t.length)                         acc[acc.length - 1].phones = t;
    return acc;
  }, []);
  const compose = (...funcs) => d => funcs.reduce((acc, func) => func(acc), d)
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["statement"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": compose(flag('main'), getTerminal)},
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("whiteSpace") ? {type: "whiteSpace"} : whiteSpace)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": remove},
    {"name": "__", "symbols": [(lexer.has("whiteSpace") ? {type: "whiteSpace"} : whiteSpace)], "postprocess": remove},
    {"name": "statement", "symbols": ["comment"]},
    {"name": "statement", "symbols": ["definition"], "postprocess": compose(clearNull, getTerminal)},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": compose(remove, getTerminal)},
    {"name": "definition", "symbols": [(lexer.has("kwSet") ? {type: "kwSet"} : kwSet), "__", "setDefinition"], "postprocess": d => ({token: 'setDefinition', sets: d[2]})},
    {"name": "setDefinition$ebnf$1", "symbols": []},
    {"name": "setDefinition$ebnf$1$subexpression$1", "symbols": [(lexer.has("setIdentifier") ? {type: "setIdentifier"} : setIdentifier), "__", (lexer.has("equal") ? {type: "equal"} : equal), "__", "setExpression", (lexer.has("comma") ? {type: "comma"} : comma), "__"]},
    {"name": "setDefinition$ebnf$1", "symbols": ["setDefinition$ebnf$1", "setDefinition$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "setDefinition", "symbols": ["setDefinition$ebnf$1", (lexer.has("setIdentifier") ? {type: "setIdentifier"} : setIdentifier), "__", (lexer.has("equal") ? {type: "equal"} : equal), "__", "setExpression"], "postprocess": constructSet},
    {"name": "setExpression", "symbols": [(lexer.has("openSquareBracket") ? {type: "openSquareBracket"} : openSquareBracket), "_", "phoneList", "_", (lexer.has("closeSquareBracket") ? {type: "closeSquareBracket"} : closeSquareBracket)], "postprocess": d => d.filter(t => t && t.length)},
    {"name": "phoneList$ebnf$1", "symbols": []},
    {"name": "phoneList$ebnf$1$subexpression$1", "symbols": [(lexer.has("phone") ? {type: "phone"} : phone), (lexer.has("comma") ? {type: "comma"} : comma), "_"]},
    {"name": "phoneList$ebnf$1", "symbols": ["phoneList$ebnf$1", "phoneList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "phoneList", "symbols": ["phoneList$ebnf$1", (lexer.has("phone") ? {type: "phone"} : phone)], "postprocess":  d => d.filter(t => t && (t.type === 'phone' || t.length) )
        .map(t => {
          if (!t.length) return t;
          t.filter(st => st && st.type === 'phone')
          return t;
        }) }
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
