import { parser } from './parser';

export const codeGenerator = (latl) => {
  const results = parser().feed(latl).results;
  
  const nodeReader = (code, node) => {
    if (node.length) {
      return results.reduce(nodeReader, code)
    }
    if (!node) return code;
    if (node.main) {
      return nodeReader(code, node.main)
    }
    return code + node;
  }

  return nodeReader('', results)

}