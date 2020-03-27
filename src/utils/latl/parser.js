const nearley = require("nearley");
const grammar = require("./grammar.js");

export const parser = () => new nearley.Parser(nearley.Grammar.fromCompiled(grammar));