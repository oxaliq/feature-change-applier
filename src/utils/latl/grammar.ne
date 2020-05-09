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
    getTerminal,
    clearNull,
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
    objFromArr
  ) %}

comment         -> %comment 
  {% pipe(getTerminal, remove) %}

# SETS
definition      -> %kwSet __ setDefinition 
                {% pipe(
                  d => ({[d[0].value]: objFromArr(d[2]) }),
                ) %}
                # {% flag('definition') %}
setDefinition   -> (%setIdentifier __ equal __ setExpression %comma __):* %setIdentifier __ equal __ setExpression
                {% 
                  pipe(
                    d => d.filter(t => !!t && t.length !== 0),
                    d => d.map(t => t.type === 'setIdentifier' ? { setIdentifier: t.toString() } : t),
                    d => d.map(t => t && t.length && t[0].hasOwnProperty('setExpression') ? t[0] : t)
                  )    
                %}
setExpression   -> %openSquareBracket _ phoneList _ %closeSquareBracket
                {% 
                  pipe(
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
