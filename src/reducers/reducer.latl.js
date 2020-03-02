

export const setLatl = (state, action) => {
  let latl = action.value;
  return {...state, latl};
}

export const parseLatl = (state, action) => {
  let latl = state.action;
  return { ...state }
}

const getOneToken = (latl, tokens) => {
  for (const [type, regEx] of tokenTypes) {
    const newRegEx = new RegExp(`^(${regEx})`);
    const match = latl.match(newRegEx) || null;
    if (match) {
      const newTokens = [...tokens, match[0]]
      const newLatl = latl.slice(match[0].length ,).trim();
      return [newLatl, newTokens]
    }
  }
  throw `Unexpected token at ${latl.split('\n')[0]}` 
}

export const tokenize = latl => {
  let i = 0;
  let tokens = [];
  let newLatl = latl.trim();
  try {
    while(newLatl.length) {
      [newLatl, tokens] = getOneToken(newLatl, tokens)
    }
    return tokens;
  } 
  catch (err) {
    return {errors: 'tokenization error', message: err}
  }
}

export const generateAST = latl => {
  
  // tokenize
  const tokens = tokenize(latl);


  // build tree

}

const tokenTypes = [
[`star`, `\\*`],
['pipe', `\\|`],
['openBracket', `\\[`],
['closeBracket', `\\]`],
['positiveAssignment', `\\+=`],
['negativeAssignment', `\\-=`],
['plus', `\\+`],
['minus', `\\-`],
['greaterThan', `\\>`],
['hash', `#`],
['slash', `\/`],
['dot', `\\.`],
['loDash', `\\_`],
[`variable`, `[A-Za-z]+`],
['equal', `=`]
// [`lineBreak`, `\\n`],
// [`whiteSpace`, `\\s+`]
]