import { assertionData } from './assertionData';
import { codeGenerator } from '../codeGenerator';

describe('codeGenerator', () => {
  it('parses simple comment', () => {
    const { latl, code } = assertionData.simpleComment;
    const generatedCode = codeGenerator(latl);
    expect(generatedCode).toEqual(code);
  });
})