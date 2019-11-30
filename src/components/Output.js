import React from 'react';
import './Output.scss';

const Output = props => {
  return (
    <div className="Output" data-testid="Output">
      <h3>Results of Run</h3>

      <div data-testid="Output-lexicon">
        {props.results ? props.results.map((lexicalItem, i) => <p key={`output-lexical-item-${i}`}>{lexicalItem}</p>) : <></>}
      </div>
    </div>
  );
}

export default Output;