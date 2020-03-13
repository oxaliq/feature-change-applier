// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const lexer = require('./lexer');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["statement", {"literal":"\n"}]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"]},
    {"name": "main$ebnf$1$subexpression$2", "symbols": ["statement", {"literal":"\n"}]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1"]},
    {"name": "statement", "symbols": [{"literal":"foo"}]},
    {"name": "statement", "symbols": [{"literal":"bar"}]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
