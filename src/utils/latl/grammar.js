// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const { lexer } = require('./lexer.js');
  const getTerminal = d => d ? d[0] : null;
  const getAll = d => d.map((item, i) => ({ [i]: item }));
  const flag = token => d => d.map(item => ({ [token]: item }))
  const clearNull = d => d.filter(t => !!t && (t.length !== 1 || t[0])).map(t => t.length ? clearNull(t) : t);
  const flagIndex = d => d.map((item, i) => ({[i]: item}))
  const remove = _ => null;
  const append = d => d.join('');
  const constructSet =  d => d.reduce((acc, t) => { 
    if (t && t.type === 'setIdentifier') acc.push({set: t});
    if (t && t.length) acc[acc.length - 1].phones = t;
    return acc;
  }, []);
  const pipe = (...funcs) => d => funcs.reduce((acc, func) => func(acc), d);
  const objFromArr = d => d.reduce((obj, item) => ({ ...obj, ...item }), {});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["_", "statement"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["main$ebnf$1", "_"], "postprocess":  pipe(
          clearNull,
          // recursive call to fix repeat?
          d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
          d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
          flag('main'), 
          getTerminal,
        ) },
    {"name": "_$ebnf$1$subexpression$1", "symbols": [(lexer.has("whiteSpace") ? {type: "whiteSpace"} : whiteSpace)]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": remove},
    {"name": "__", "symbols": [(lexer.has("whiteSpace") ? {type: "whiteSpace"} : whiteSpace)], "postprocess": remove},
    {"name": "equal", "symbols": [(lexer.has("equal") ? {type: "equal"} : equal)], "postprocess": remove},
    {"name": "statement", "symbols": ["comment"]},
    {"name": "statement", "symbols": ["definition"], "postprocess":  pipe(
          d => d.flatMap(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
          // recursive call to fit repeat?
          d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
          d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
          // may split from other definition statements
          d => d.map(t => t && t.length > 1 ? ({ type: 'set', ...objFromArr(t) }) :  null)
        ) },
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": pipe(getTerminal, remove)},
    {"name": "definition$ebnf$1", "symbols": []},
    {"name": "definition$ebnf$1$subexpression$1", "symbols": ["setDefinition", (lexer.has("comma") ? {type: "comma"} : comma), "__"]},
    {"name": "definition$ebnf$1", "symbols": ["definition$ebnf$1", "definition$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "definition", "symbols": [(lexer.has("kwSet") ? {type: "kwSet"} : kwSet), "__", "definition$ebnf$1", "setDefinition"], "postprocess":  pipe(
          // not yet sure why this call is required twice
          d => d.map(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
          d => d.map(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
          d => d.map(u => u && u.length ? u.map(v => v.length ? v.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet')[0] : v) : u),
          clearNull,
        ) },
    {"name": "setDefinition", "symbols": [(lexer.has("setIdentifier") ? {type: "setIdentifier"} : setIdentifier), "__", "equal", "__", "setExpression"], "postprocess":  
        pipe(
          d => d.filter(t => !!t && t.length !== 0),
          d => d.map(t => t.type === 'setIdentifier' ? { setIdentifier: t.toString() } : t),
          d => d.map(t => t && t.length && t[0].hasOwnProperty('setExpression') ? t[0] : t),
        )    
                        },
    {"name": "setExpression", "symbols": [(lexer.has("openSquareBracket") ? {type: "openSquareBracket"} : openSquareBracket), "_", "phoneList", "_", (lexer.has("closeSquareBracket") ? {type: "closeSquareBracket"} : closeSquareBracket)], "postprocess":  
        pipe(
          // filters commas and whitespace
          d => d.filter(t => t && t.length),
          d => d.map(t => t.map(u => u[0])),
          flag('setExpression') 
        ) },
    {"name": "phoneList$ebnf$1", "symbols": []},
    {"name": "phoneList$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "phoneList$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma), "_"]},
    {"name": "phoneList$ebnf$1$subexpression$1$ebnf$1", "symbols": ["phoneList$ebnf$1$subexpression$1$ebnf$1", "phoneList$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "phoneList$ebnf$1$subexpression$1", "symbols": [(lexer.has("phone") ? {type: "phone"} : phone), "phoneList$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "phoneList$ebnf$1", "symbols": ["phoneList$ebnf$1", "phoneList$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "phoneList", "symbols": ["phoneList$ebnf$1"], "postprocess":  
        pipe(
          d => d ? d[0].map(t => t.filter(u => u.type === 'phone').map(u => u.toString())) : d
        )
                        }
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();