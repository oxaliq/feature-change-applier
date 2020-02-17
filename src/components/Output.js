import React from 'react';
import './Output.scss';

const Output = props => {
  const { results } = props;
  return (
    <div className="Output" data-testid="Output">
      <h3>Results of Run</h3>

      <div data-testid="Output-lexicon">
        {results && results.length ? results[0].lexicon.map((lexicalItem, i) => <p key={`output-lexical-item-${i}`}>{lexicalItem}</p>) : <></>}
      </div>
    </div>
  );
}

export default Output;