@{%
  const lexer = require('./lexer');
%}

@lexer lexer

main        -> (statement "\n"):+
statement   -> "foo" | "bar"