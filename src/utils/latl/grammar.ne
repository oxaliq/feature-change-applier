@{%
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
%}

@lexer lexer

main            -> (statement):* 
  {% compose(flag('main'), getTerminal) %}

_               -> (%whiteSpace):? 
  {% remove %}

__              -> %whiteSpace 
  {% remove %}

statement       -> comment | definition 
  {% compose(clearNull, getTerminal) %}

comment         -> %comment 
  {% compose(remove, getTerminal) %}

# SETS
definition      -> %kwSet __ setDefinition {% d => ({token: 'setDefinition', sets: d[2]}) %}
setDefinition   -> (%setIdentifier __ %equal __ setExpression %comma __):* %setIdentifier __ %equal __ setExpression
  {% constructSet %}
setExpression   -> %openSquareBracket _ phoneList _ %closeSquareBracket
  {% d => d.filter(t => t && t.length) %}
phoneList       -> (%phone %comma _):* %phone
  {% d => d.filter(t => t && (t.type === 'phone' || t.length) )
  .map(t => {
    if (!t.length) return t;
    t.filter(st => st && st.type === 'phone')
    return t;
  }) %}


# assignmentExpression:
# 	/*
# 	 * SPEC:
# 	 * conditionalExpression
# 	 * | leftHandSideExpression assignmentOperator assignmentExpression
# 	 */
# 	(leftHandSideExpression assignmentOperator) =>
# 	leftHandSideExpression assignmentOperator assignmentExpression
# 	| conditionalExpression
# 	;

# assignmentExpressionNoln:
# 	conditionalExpressionNoln
# 	| leftHandSideExpression assignmentOperator assignmentExpressionNoln
# 	;

# assignmentOperator:
# 	/* note that in the grammar these are listed out explicitely */
# 	EQ | TIMESEQ | DIVIDEEQ | PERCENTEQ | PLUSEQ | MINUSEQ | LSHIFTEQ | RSHIFTEQ
# 	| GT3EQ | AMPEREQ | CAROTEQ | PIPEEQ
# 	;

# expression:
# 	/* 
# 	 * SPEC:
# 	 * assignmentExpression
# 	 * | expression COMMA assignmentExpression
# 	 */
# 	assignmentExpression (expressionTail)*
# 	;