import { lexer } from '../lexer';
import { parser } from '../parser';
import { assertionData } from './assertionData';

describe('parser', () => {
  it('parses simple comment', () => {
    const { latl, AST } = assertionData.simpleComment;
    const feedResults = parser().feed(latl).results;
    expect(feedResults.length).toBe(1);
    expect(feedResults[0]).toStrictEqual(AST)
  })

  it('parses simple set definition', () => {
    const { latl, AST } = assertionData.simpleSetDefinition;
    const feedResults = parser().feed(latl).results;
    expect(feedResults.length).toBe(1);
    expect(feedResults[0]).toStrictEqual(AST);
  })

  it('parses multiple set definitions with comma operator', () => {
    const { latl, AST } = assertionData.commaSetDefinition;
    const feedResults = parser().feed(latl).results;
    expect(feedResults.length).toBe(1);
    expect(feedResults[0]).toStrictEqual(AST);
  });

  it('lexes set definition with alias'
  , () => {
    const { latl, AST } = assertionData.setAliasDefinition;
    const feedResults = parser().feed(latl).results;
    expect(feedResults[0]).toStrictEqual(AST);
  }
  );

  it('lexes set definition with set join', () => {
    const { latl, AST } = assertionData.setDefinitionJoin;
    const feedResults = parser().feed(latl).results;
    expect(feedResults[0]).toStrictEqual(AST);
  }
  );

  it.todo('lexes set definition with yield operation'
  // , () => {
  //   const { latl, tokens } = assertionData.setDefinitionYield;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // }
  );

  it.todo('lexes all set join operations'
  // , () => {
  //   const { latl, tokens } = assertionData.setOperationsJoin;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // }
  );

  it.todo('lexes set filter, concat, and dissoc operations'
  // , () => {
  //   const { latl, tokens } = assertionData.setOperations;
  //   const stream           = getStream(latl);
  //   expect(stream).toStrictEqual(tokens);
  // }
  )
})

// {
//   "set": 
//     [
//       [
//         [
//           {
//             "col": 5,
//             "line": 2,
//             "lineBreaks": 0,
//             "offset": 5,
//             "text": "NASAL_PULMONIC_CONSONANTS",
//             "toString": [tokenToString],
//             "type": "setIdentifier",
//             "value": "NASAL_PULMONIC_CONSONANTS",
//           },
//           null,
//           {
//             "col": 45,
//             "line": 2,
//             "lineBreaks": 0,
//             "offset": 45,
//             "text": "=",
//             "toString": [tokenToString],
//             "type": "equal",
//             "value": "=",
//           },
//           null,
//           [
//             [
//               {
//                 "col": 49,
//                 "line": 2,
//                 "lineBreaks": 0,
//                 "offset": 49,
//                 "text": "m̥",
//                 "toString": [tokenToString],
//                 "type": "phone",
//                 "value": "m̥",
//               },
//               {
//                 "col": 91,
//                 "line": 2,
//                 "lineBreaks": 0,
//                 "offset": 91,
//                 "text": "ɴ",
//                 "toString": [tokenToString],
//                 "type": "phone",
//                 "value": "ɴ",
//               },
//             ],
//           ],
//           {
//             "col": 94,
//             "line": 2,
//             "lineBreaks": 0,
//             "offset": 94,
//             "text": ",",
//             "toString": [tokenToString],
//             "type": "comma",
//             "value": ",",
//           },
//           null,
//         ],
//               ],
//     -         "setIdentifier": "STOP_PULMONIC_CONSONANTS",
//       {
//         "col": 5,
//         "line": 3,
//         "lineBreaks": 0,
//         "offset": 100,
//         "text": "STOP_PULMONIC_CONSONANTS",
//         "toString": [tokenToString],
//         "type": "setIdentifier",
//         "value": "STOP_PULMONIC_CONSONANTS",
//       },
//       null,
//       {
//         "col": 45,
//         "line": 3,
//         "lineBreaks": 0,
//         "offset": 140,
//         "text": "=",
//         "toString": [tokenToString],
//         "type": "equal",
//         "value": "=",
//               },
//       null,
//       [
//         [
//           {
//             "col": 49,
//             "line": 3,
//             "lineBreaks": 0,
//             "offset": 144,
//             "text": "p",
//             "toString": [tokenToString],
//             "type": "phone",
//             "value": "p",
//           },
//           {
//             "col": 104,
//             "line": 3,
//             "lineBreaks": 0,
//             "offset": 199,
//             "text": "ʔ",
//             "toString": [tokenToString],
//             "type": "phone",
//             "value": "ʔ",
//           },
//         ],
//       ],
//     ],
//     "token": "kwSet",
//   }