import { assertionData } from './assertionData';
import { codeGenerator } from '../codeGenerator';

describe('codeGenerator', () => {
  it('parses simple comment', () => {
    const { latl } = assertionData.simpleComment;
    const code = codeGenerator(latl)
    // expect(AST.length).toBe(1);
    // expect(AST[0]).toStrictEqual({ main: [ ]})
    console.log(code)
  })
})