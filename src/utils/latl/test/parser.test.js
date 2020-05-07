import { lexer } from '../lexer';
import { parser } from '../parser';
import { assertionData } from './assertionData';

describe('parser', () => {
  it('parses simple comment', () => {
    const { latl } = assertionData.simpleComment;
    const AST = parser().feed(latl).results;
    expect(AST.length).toBe(1);
    expect(AST[0]).toStrictEqual({ main: [ ]})
  })

  // it('parses multiple set definitions with comma operator', () => {
  //   const { latl } = assertionData.commaSetDefinition;
  //   const AST = parser().feed(latl).results;
  //   console.log(AST[0])
  // });

  // it('lexes set definition with alias', () => {
  //   const { latl, tokens } = assertionData.setAliasDefinition;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // });

  // it('lexes set definition with set join', () => {
  //   const { latl, tokens } = assertionData.setDefinitionJoin;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // });

  // it('lexes set definition with yield operation', () => {
  //   const { latl, tokens } = assertionData.setDefinitionYield;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // });

  // it('lexes all set join operations', () => {
  //   const { latl, tokens } = assertionData.setOperationsJoin;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // });

  // it('lexes set filter, concat, and dissoc operations', () => {
  //   const { latl, tokens } = assertionData.setOperations;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // })
})
