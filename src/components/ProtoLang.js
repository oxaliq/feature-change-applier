import React from 'react';
import './ProtoLang.scss';

const ProtoLang = ({ lexicon, dispatch }) => {
  const getProperty = property => object => object[property];
  const renderLexicon = () => {
    if (!lexicon) return '';
    // Code for optionally rendering epoch name with lexeme
    // `\t#${lexeme.epoch.name}`
    return lexicon.map(getProperty('lexeme')).join('\n');
  }

  return (
    <div className="ProtoLang" data-testid="ProtoLang">
      <h3>Proto Language Lexicon</h3>
      <br />
      <form data-testid="ProtoLang-Lexicon">
        <textarea
          name="lexicon" 
          cols="30"
          rows="10"
          data-testid="ProtoLang-Lexicon__textarea"
          value={renderLexicon()}
          onChange={e=> {
            console.log(e.target.value.split(/\n/).map(line => {
              const lexeme = line.split('#')[0].trim();
              const epoch = line.split('#')[1] || '';
              return { lexeme, epoch }
              }))
            dispatch({
              type: 'SET_LEXICON', 
              value: e.target.value.split(/\n/).map(line => {
                const lexeme = line.split('#')[0].trim();
                const epoch = line.split('#')[1] || '';
                return { lexeme, epoch }
              })
            })
          }
          }>
        </textarea>
      </form>
    </div>
  );
}

export default ProtoLang;