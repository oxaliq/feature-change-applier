import { stateReducer } from './reducer';

export const setLatl = (state, action) => {
  let latl = action.value;
  return {...state, latl, parseResults: ''};
}

const getOneToken = (latl, tokens) => {
  for (const [type, regEx] of tokenTypes) {
    const newRegEx = new RegExp(`^(${regEx})`);
    const match = latl.match(newRegEx) || null;
    if (match) {
      const newTokens = [...tokens, {type, value: match[0].trim()}]
      const newLatl = latl.slice(match[0].length ,);
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
    case 'feature--plus': {
      // tree[tree.length - 1].type === 'feature';
      return tree;
    }
    case 'feature--minus': {
      // tree[tree.length - 1].type === 'feature';
      return tree;
    }
    default:
      return tree;
  }
}

const parseWhiteSpace = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule': {
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + ' ' }
      return tree;
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
      return [...tree, { type: 'main'}];
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
    case 'feature': {
      if (!lastNode.value) {
        tree[tree.length - 1].value = token.value;
        return tree;
      }
    }
    case 'feature--plus': {
      if (lastNode.value) {
        lastNode.positivePhones = [...lastNode.positivePhones, token.value ]
      }
      else {
        lastNode.value = token.value;
      }
      tree[tree.length - 1] = lastNode;
      return [...tree]
    }
    case 'feature--minus': {
      if (lastNode.value) {
        lastNode.negativePhones = [...lastNode.negativePhones, token.value ]
      }
      else {
        lastNode.value = token.value;
      }
      tree[tree.length - 1] = lastNode;
      return [...tree]
    }
    case 'lexicon': {
      if (!lastNode.epoch) {
        tree[tree.length - 1].epoch = token.value;
      }
      else {
        tree[tree.length - 1].value.push(token.value)
      }
      return tree;
    }
    default:
      return [...tree, `unexpected referent ${token.value}`]
    }
  }
  
const parsePhone = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch(lastNode.type) {
    case 'rule': {
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
      return tree;
    }
    case 'feature--plus':
      lastNode.positivePhones = [...lastNode.positivePhones, token.value ];
      tree[tree.length - 1] = lastNode;
      return tree;
    case 'feature--minus':
      lastNode.negativePhones = [...lastNode.negativePhones, token.value ];
      tree[tree.length - 1] = lastNode;
      return tree;
    default:
      return [...tree, `unexpected phone ${token.value}`]
  }
}
  
const parseOpenBracket = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  if (lastNode) {
    switch (lastNode.type) {
      case 'epoch':
        return [...tree, {type: 'rule', value: token.value}]
      case 'rule':
        tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
        return tree;
      case 'ruleSet':
        return [...tree, {type: 'rule', value: token.value}];
      // case 'feature':
      //   return [{type: 'feature', positivePhones: [], negativePhones: []}];
      case 'feature--plus':
        return [...tree, {type: 'feature', positivePhones: [], negativePhones: []}];
      case 'feature--minus':
        return [...tree, {type: 'feature', positivePhones: [], negativePhones: []}];
      case 'main':
        return [...tree, {type: 'feature', positivePhones: [], negativePhones: []}];
      default:
        return [...tree, 'unexpected open bracket']
    }
  }
  return [{type: 'feature', positivePhones: [], negativePhones: []}]
}
      
const parseCloseBracket = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value }
      return tree;
    case 'feature--plus':
      return tree;
    case 'feature--minus':
      return tree;
    default:
      return [...tree, 'unexpected close bracket']
  }
}

const parsePositiveAssignment = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'feature':
      tree[tree.length - 1].type = 'feature--plus'
      return tree;
    default:
      return [...tree, 'unexpected positive assignment']
  }
}

const parseNegativeAssignment = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'feature':
      tree[tree.length - 1].type = 'feature--minus'
      return tree;
    case 'feature--plus':
      tree[tree.length - 1].type = 'feature--minus';
      return tree;
    default:
      return [...tree, 'unexpected negative assignment']
  }
}

const parsePlus = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'rule':
      tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
      return tree;
    case 'feature':
      tree[tree.length - 1] = {...lastNode, type: 'feature--plus'}
      return tree;
    case 'feature--minus':
      tree[tree.length - 1] = {...lastNode, type: 'feature--minus'}
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
    case 'feature':
      tree[tree.length - 1] = {...lastNode, type: 'feature--minus'}
      return tree;
    default:
      return [...tree, 'unexpected minus']
  }
}

const parseEqual = (tree, token, index, tokens) => {
  const lastNode = tree[tree.length - 1];
  switch (lastNode.type) {
    case 'feature--plus':
      return tree;
    case 'feature--minus':
      return tree;
    default:
      return [...tree, 'unexpected equal'];
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
  if (lastNode) {
    switch (lastNode.type) {
      case 'rule':
        tree[tree.length - 1] = {...lastNode, value: lastNode.value + token.value}
        return tree;
      case 'feature--plus':
        return tree;
      case 'feature--minus':
        return tree;
      case 'lexicon':
        return [...tree, { }];
      case 'main':
        return [...tree, { type: 'lexicon', value: []}]
      default:
        return [...tree, 'unexpected slash']
    }
  }
  return [...tree, { type: 'lexicon', value: []}]
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
    case 'whiteSpace':
      return parseWhiteSpace(tree, token, index, tokens);
    // if *PROTO consume token:* and add epochs: [ { parent: 'PROTO' } ]
    case 'star': 
      return parseStar(tree, token, index, tokens);
    case 'pipe':
      return parsePipe(tree, token, index, tokens);
    case 'referent':
      return parseReferent(tree, token, index, tokens);
    case 'phone':
      return parsePhone(tree, token, index, tokens);
    case 'openBracket':
      return parseOpenBracket(tree, token, index, tokens);
    case 'closeBracket':
      return parseCloseBracket(tree, token, index, tokens);
    case 'positiveAssignment':
      return parsePositiveAssignment(tree, token, index, tokens);
    case 'negativeAssignment':
      return parseNegativeAssignment(tree, token, index, tokens);
    case 'plus':
      return parsePlus(tree, token, index, tokens);
    case 'minus':
      return parseMinus(tree, token, index, tokens);
    case 'equal':
      return parseEqual(tree, token, index, tokens);
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
      return {...tree, epochs: [...tree.epochs, {...node, index: tree.epochs.length } ] }
    case 'feature':
      node.feature = node.value;
      delete node.value;    
      delete node.type;
      return {...tree, features: [...tree.features, {...node } ] }
    case 'feature--minus':
      node.feature = node.value;
      delete node.value;    
      delete node.type;
      if (tree.features.length && tree.features[tree.features.length - 1].feature === node.feature) {
        tree.features[tree.features.length - 1].negativePhones = node.negativePhones
        return tree;
      }
      return {...tree, features: [...tree.features, {...node} ] }
    case 'feature--plus':
      delete node.type;
      node.feature = node.value;
      delete node.value;
      if (tree.features.length && tree.features[tree.features.length - 1].feature === node.feature) {
        tree.features[tree.features.length - 1].positivePhones = node.positivePhones
        return tree;
      }
      return {...tree, features: [...tree.features, {...node} ] }
    case 'lexicon':
      delete node.type;
      return {...tree, lexicon: [...tree.lexicon, node]}
    default:
      return tree;
  }
}

export const buildTree = tokens => {
  const bareTree = {
    epochs: [],
    features: [],
    lexicon: []
  }
  const nodes = tokens.reduce(addToken, []);
  // return nodes
  const tree = nodes.reduce(connectNodes, bareTree);
  const filterProps = Object.entries(tree).filter(([key, value]) => !value.length)
    .map(([key, value]) => key)
  return filterProps.reduce((tree, badProp) => {
    delete tree[badProp];
    return tree;
  }, tree);
}

export const generateAST = latl => {
  // tokenize
  const tokens = tokenize(latl.trim());
  // build tree
  const tree = buildTree(tokens);
  return tree;
}

export const parseLatl = (state, action) => {
  try {
    const latl = state.latl;
    const AST = generateAST(latl);
    const features = AST.features;
    if (features) {
      if (state.features) {
        state = Object.keys(state.features).reduce((state, feature) => {
          return stateReducer(state, {type: 'DELETE_FEATURE', value: feature})
        }, state)
      }
      state = features.reduce((state, feature) => stateReducer(state, {type:'ADD_FEATURE', value: feature}), state);
    }
    delete AST.features;
    const lexicon = AST.lexicon;
    if (lexicon) {
      if (state.lexicon) {
        state.lexicon = [];
      }
      state = lexicon.reduce((state, epoch) => {
        return epoch.value.reduce((reducedState, lexeme) => {
          return stateReducer(reducedState, {type: 'ADD_LEXEME', value: { lexeme, epoch: epoch.epoch }})
        }, state)
      }, state)
    }
    delete AST.lexicon;
    Object.entries(AST).forEach(([key, value]) => state[key] = value);
    return { ...state, parseResults: 'latl parsed successfully', results:[] }
  }
  catch (e) {
    return { ...state, parseResults: 'error parsing', errors: e}
  }
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
  [`referent`, `[A-Za-z]+[\u0100-\u03FFA-Za-z0-9\\-\\_]*`],
  [`phone`, `[\u0100-\u03FFA-Za-z0]+`],
  ['equal', `=`],
  [`lineBreak`, `\\n`],
  [`whiteSpace`, `\\s+`]
]