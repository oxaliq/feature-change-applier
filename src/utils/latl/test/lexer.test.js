import { lexer } from '../lexer';
import { assertionData } from './assertionData';

describe('lexer', () => {
  const getToken    = obj => obj ? formatToken(obj) : null;
  const formatToken = obj => ({ type: obj.type, value: obj.value });
  const getStream   = latl => {
    lexer.reset(latl);
    let token = getToken(lexer.next());
    let stream = [];
    do {
      stream = [...stream, token]
      token = getToken(lexer.next());
    } while (token);
    return stream;
  }

  it('lexes simple comment', () => {
    const { latl, tokens } = assertionData.simpleComment;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  // it('lexes simple * and identifier', () => {
  //   lexer.reset('*proto');
  //   const stream = [ getToken(lexer.next()), getToken(lexer.next()) ];
  //   expect(stream).toStrictEqual([ { type: 'star', value: '*' }, { type: 'identifier', value: 'proto' } ]);
  // })

  it('lexes set and identifier', () => {
    const { latl, tokens } = assertionData.simpleSetDefinition;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  })

  it('lexes multiple set definitions with comma operator', () => {
    const { latl, tokens } = assertionData.commaSetDefinition;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  it('lexes set definition with alias', () => {
    const { latl, tokens } = assertionData.setAliasDefinition;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  it('lexes set definition with set join', () => {
    const { latl, tokens } = assertionData.setDefinitionJoin;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  it('lexes set definition with yield operation', () => {
    const { latl, tokens } = assertionData.setDefinitionYield;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  it('lexes all set join operations', () => {
    const { latl, tokens } = assertionData.setOperationsJoin;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  });

  it('lexes set filter, concat, and dissoc operations', () => {
    const { latl, tokens } = assertionData.setOperations;
    const stream           = getStream(latl);
    expect(stream).toStrictEqual(tokens);
  })
})