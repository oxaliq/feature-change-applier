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
          value={props.lexicon ? props.lexicon.map(lexeme => `${lexeme.lexeme} \t#${lexeme.epoch.name}`).join('\n'): ''}
          onChange={e=>props.dispatch({action: 'SET_LEXION', value: e.target.value.split(/\n/)})}
          >
        </textarea>
      </form>
    </div>
  );
}

export default ProtoLang;