import React from 'react';
import './ProtoLang.scss';

const ProtoLang = (props) => {
  return (
    <div className="ProtoLang" data-testid="ProtoLang">
      <h3>Proto Language Lexicon</h3>
      <br />
      <form data-testid="ProtoLang-Lexicon">
        <textarea
          name="lexicon" 
          data-testid="ProtoLang-Lexicon__textarea"
          value={props.lexicon ? props.lexicon.map(lexeme => `${lexeme.lexeme} \t#${lexeme.epoch.name}`).join('\n'): ''}
          onChange={e=> {
            console.log(e.target.value.split(/\n/).map(line => {
              const lexeme = line.split('#')[0].trim();
              const epoch = line.split('#')[1] || '';
              return { lexeme, epoch }
              }))
            props.dispatch({
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