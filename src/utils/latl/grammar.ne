@{%
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
%}

@lexer lexer

main            -> (_ statement):* _
  {% pipe(
    clearNull,
    // recursive call to fix repeat?
    d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
    d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
    flag('main'), 
    getTerminal,
  ) %}

_               -> (%whiteSpace):? 
  {% remove %}

__              -> %whiteSpace 
  {% remove %}

equal           -> %equal
  {% remove %}

statement       -> comment | definition
  {% pipe(
    d => d.flatMap(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
    // recursive call to fit repeat?
    d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
    d => d.map(t => t && t.length === 1 && t[0] ? t[0] : t),
    // may split from other definition statements
    d => d.map(t => t && t.length > 1 ? ({ type: 'set', ...objFromArr(t) }) :  null)
  ) %}

comment         -> %comment 
  {% pipe(getTerminal, remove) %}

# SETS
definition      -> %kwSet __ (setDefinition %comma __):* setDefinition
                {% pipe(
                  // not yet sure why this call is required twice
                  d => d.map(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
                  d => d.map(u => u && u.length ? u.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet') : u),
                  d => d.map(u => u && u.length ? u.map(v => v.length ? v.filter(t => t && t.type !== 'comma' && t.type !== 'kwSet')[0] : v) : u),
                  clearNull,
                ) %}
setDefinition   -> %setIdentifier (setAlias):? __ equal __ setExpression
                {% 
                  pipe(
                    d => d.filter(t => !!t && t.length !== 0),
                    d => d.map(u => u && u.length ? u.map(t => t && t.length ? t.filter(v => v && v.type !== 'comma') : t) : u),
                    d => d.map(t => t.type === 'setIdentifier' ? { setIdentifier: t.toString() } : t),
                    d => d.map(t => t && t.length && t[0].hasOwnProperty('setExpression') ? t[0] : t),
                    d => d.map(t => t.length ?
                      // pretty ugly ([ { type: 'aias', alias: [ string ] }] ) => { setAlias: str }
                      { setAlias: t.reduce((aliases, token) => token && token.type === 'alias' ? [...aliases, ...token.alias] : aliases, [])[0] }
                    : t),
                  )    
                %}
setAlias        -> %comma _ %setIdentifier
                {% pipe(
                  d => d && d.length ? d.filter(t => !!t) : d,
                  d => d.map(t => t.type === 'setIdentifier' ? t.toString() : null),
                  d => d.filter(t => !!t),
                  d => ({type: 'alias', alias: d }),
                ) %}
setExpression   -> %openSquareBracket _ phoneList _ %closeSquareBracket
                | %openCurlyBracket _ (setOperation):? _ %closeCurlyBracket
                {% 
                  pipe(
                    // filters commas and whitespace
                    d => d.filter(t => t && t.length),
                    d => d.map(t => t.map(u => u[0])),
                    flag('setExpression') 
                  ) %}
phoneList       -> (%phone (%comma _):* ):*
                {% 
                  pipe(
                    d => d ? d[0].map(t => t.filter(u => u.type === 'phone').map(u => u.toString())) : d
                  )
                %}
setOperation    -> orOperation 
                |  %identifier
                {% pipe(
                  d => d.type ? d : ({ identifier: d.toString(), type: 'identifier' })
                )%}

orOperation     -> _ setOperation __ %kwSetOr __ setOperation _
                {% pipe(
                  d => d.filter(d => !!d),
                  d => ({ type: 'operator', operator: 'or', operands: [ d[0], d[2] ] }),
                ) %}