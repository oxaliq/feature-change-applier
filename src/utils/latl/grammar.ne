@{%
  const { lexer } = require('./lexer.js');
  const getTerminal = d => d ? d[0] : null;
  const getAll = d => d.map((item, i) => ({ [i]: item }));
  const flag = token => d => d.map(item => ({ [token]: item }))
  const clearNull = d => d.filter(t => !!t);
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

main            -> (_ statement _):* 
  {% pipe(clearNull, flag('main'), getTerminal) %}

_               -> (%whiteSpace):? 
  {% remove %}

__              -> %whiteSpace 
  {% remove %}

statement       -> comment | definition
  {% getTerminal, clearNull %}

comment         -> %comment 
  {% pipe(getTerminal, remove) %}

# SETS
definition      -> %kwSet __ setDefinition 
                {% d => ({token: d[0].type, [d[0].value]: d[2]}) %}
setDefinition   -> (%setIdentifier __ %equal __ setExpression %comma __):* %setIdentifier __ %equal __ setExpression
                # {% pipe(
                #   //constructSet, 
                #   getTerminal) %}
setExpression   -> %openSquareBracket _ phoneList _ %closeSquareBracket
  {% d => d.filter(t => t && t.length) %}
phoneList       -> (%phone %comma _):* %phone
                # {% clearNull %}
  {% d => d.filter(t => t && (t.type === 'phone' || t[0]) )
  .flatMap(t => {
    if (!t.length) return t;
    return t[0].filter(st => st && st.type === 'phone')
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