export const setLatl = (state, action) => {
  let latl = action.value;
  return {...state, latl};
}

const getOneToken = (latl, tokens) => {
  for (const [type, regEx] of tokenTypes) {
    const newRegEx = new RegExp(`^(${regEx})`);
    const match = latl.match(newRegEx) || null;
    if (match) {
      const newTokens = [...tokens, {type, value: match[0].trim()}]
      const newLatl = latl.slice(match[0].length ,).replace(/\ /,'');
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

const parseLineBreak = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule': {
      if (tree[tree.length - 2].type === 'ruleSet') {
        const ruleValue = lastNode.value;
        tree[tree.length - 2].value.push(ruleValue);
        tree.pop()
        return tree;
      }
      if (tree[tree.length - 2].type === 'epoch') {
        const newNode = { type: 'ruleSet', value: [ lastNode.value ] }
        tree[tree.length - 1] = newNode;
        return tree;
      }
    }
    default:
      return tree;
  }
}

const parseStar = (tree, token, index, tokens) => {
  const nextToken = tokens[index + 1];
  if (nextToken.type === 'referent') {
    return [...tree, { type: 'epoch-parent' }]
  }
}

const parsePipe = (tree, token, index, tokens) => {
  const nextToken = tokens[index + 1];
  if (nextToken.type === 'referent') {
    const ruleToken = tree[tree.length - 1];
    const epochToken = tree[tree.length - 2];
    if (ruleToken.type === 'rule' || ruleToken.type === 'ruleSet') {
      if (epochToken.type === 'epoch') {
        tree[tree.length - 2] = {
          ...epochToken,
          changes: [...ruleToken.value],
          type: 'epoch-name'
        }
        tree.pop();
        return tree;
      }
    }
  }
  return [...tree, 'unexpected pipe']
}

const parseReferent = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'epoch-parent': {
      tree[tree.length - 1] = {...lastNode, parent: token.value, type: 'epoch' }
      return tree;
    }
    case 'epoch-name': {
      tree[tree.length - 1] = {...lastNode, name: token.value, type: 'epoch' }
      return tree;
    }
    case 'epoch': {
      return [...tree, { type: 'rule', value: token.value } ]
    }
    case 'rule': {
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
      return tree;
    }
    case 'ruleSet': {
      return [...tree, { type: 'rule', value: token.value }]
    }
    default:
      return [...tree, `unexpected referent ${token.value}`]
    }
  }
  
const parseOpenBracket = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'epoch':
      return [...tree, {type: 'rule', value: token.value}]
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
      return tree;
    default:
      return [...tree, 'unexpected open bracket']
  }
}
      
const parseCloseBracket = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
      return tree;
    default:
      return [...tree, 'unexpected close bracket']
  }
}

const parsePlus = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected plus']
  }
}

const parseMinus = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected minus']
  }
}

const parseGreaterThan = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected greater than']
  }
}

const parseSlash = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected slash']
  }
}
    
const parseHash = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected hash']
  }
}

const parseDot = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected dot']
  }
}

const parseUnderScore = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    default:
      return [...tree, 'unexpected underscore']
  }
}

const generateNode = (tree, token, index, tokens) => {
  switch (token.type) {
    // if comment, consume without effect
    case 'semicolon':
      return [...tree]
    case 'lineBreak':
      return parseLineBreak(tree, token, index, tokens);
    // if *PROTO consume token:* and add epochs: [ { parent: 'PROTO' } ]
    case 'star': 
      return parseStar(tree, token, index, tokens);
    case 'pipe':
      return parsePipe(tree, token, index, tokens);
    case 'referent':
      return parseReferent(tree, token, index, tokens);
    case 'openBracket':
      return parseOpenBracket(tree, token, index, tokens);
    case 'closeBracket':
      return parseCloseBracket(tree, token, index, tokens);
    case 'plus':
      return parsePlus(tree, token, index, tokens);
    case 'minus':
      return parseMinus(tree, token, index, tokens);
    case 'greaterThan':
      return parseGreaterThan(tree, token, index, tokens);
    case 'slash':
      return parseSlash(tree, token, index, tokens);
    case 'hash':
      return parseHash(tree, token, index, tokens);
    case 'dot':
      return parseDot(tree, token, index, tokens);
    case 'underscore':
      return parseUnderScore(tree, token, index, tokens);
    default:
      return [...tree, { ...token }]
  }
}

const addToken = (tree, token, index, tokens) => generateNode(tree, token, index, tokens);

const connectNodes = (tree, node, index, nodes) => {
  switch (node.type) {
    case 'epoch':
      delete node.type;
      return {...tree, epochs: [...tree.epochs, {...node, index: tree.epochs.length} ]}
    default:
      return tree;
  }
}

export const buildTree = tokens => {
  const bareTree = {
    epochs: [],
  }
  const nodes = tokens.reduce(addToken, []);
  // return nodes
  const tree = nodes.reduce(connectNodes, bareTree);
  return tree;
}

export const generateAST = latl => {
  // tokenize
  const tokens = tokenize(latl.trim());
  // build tree
  const tree = buildTree(tokens);
  return tree;
}

export const parseLatl = (state, action) => {
  const latl = state.latl;
  const AST = generateAST(latl);
  Object.entries(AST).forEach(([key, value]) => state[key] = value);
  return { ...state }
}

const tokenTypes = [
  ['semicolon', ';.*\n'],
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
  ['underscore', `\\_`],
  [`referent`, `[A-Za-z]+[\\w\\-\\_]*`],
  ['equal', `=`],
  [`lineBreak`, `\\n`]
  // [`whiteSpace`, `\\s+`]
]