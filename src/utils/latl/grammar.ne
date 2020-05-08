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

statement       -> comment | definition
  {% pipe(getTerminal) %}

comment         -> %comment 
  {% pipe(getTerminal, remove) %}

# SETS
definition      -> %kwSet __ setDefinition 
                {% d => ({[d[0].value]: d[2]}) %}
setDefinition   -> (%setIdentifier __ %equal __ setExpression %comma __):* %setIdentifier __ %equal __ setExpression
                {% d => {
                  if (d.type === 'setIdentifier') return { setIdentifier: d.value }
                  return d
                } %}
setExpression   -> %openSquareBracket _ phoneList _ %closeSquareBracket
                # {% pipe(d => d.filter(t => t && t.length)) %}
phoneList       -> (%phone %comma _):* %phone
                {% pipe(d => d ? d.toString() : d) %}
  # {% d => d.filter(t => t && (t.type === 'phone' || t[0]) )
  # .flatMap(t => {
  #   if (!t.length) return t;
  #   return t[0].filter(st => st && st.type === 'phone')
  # }) %}
