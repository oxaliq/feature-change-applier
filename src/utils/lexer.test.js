import { lexer } from './lexer';

describe('lexer', () => {
  const extractToken = obj => ({ type: obj.type, value: obj.value });

  it('lexes simple comment', () => {
    lexer.reset('; comment');
    const token = lexer.next();
    expect(extractToken(token)).toStrictEqual({ type: 'comment', value: '; comment'});
  });

  it('lexes simple * and identifier', () => {
    lexer.reset('*proto');
    const stream = [ extractToken(lexer.next()), extractToken(lexer.next()) ];
    expect(stream).toStrictEqual([ { type: 'star', value: '*' }, { type: 'identifier', value: 'proto' } ]);
  })

  it('lexes set and identifier', () => {
    lexer.reset('set PLOSIVES');
    const stream = [ extractToken(lexer.next()), extractToken(lexer.next()), extractToken(lexer.next()) ];
    expect(stream).toStrictEqual([ { type: 'kw-set', value: 'set' }, { type: 'space', value: ' ' }, { type: 'identifier', value: 'PLOSIVES' } ]);
  })
})