import React from 'react';
import './Output.scss';

const Output = props => {
  const { results, options } = props;
  const renderResults = () => {
    switch(options.output) {
      case 'default':
        return renderDefault();
      default:
        return <></>
    }
  }

  const renderDefault = () => {
    return results.map((epoch, i) => {
    const lexicon = epoch.lexicon.map((lexeme, i) => <span key={`${epoch.pass}-${i}`}>{lexeme}</span>);
      return (
      <div key={`epoch-${i}`} className="Output-epoch">
        <h5>{epoch.pass}</h5>
        <p className="lexicon">{lexicon}</p>
      </div>
      )
    })
  }
  return (
    <div className="Output" data-testid="Output">
      <h3>Results of Run</h3>

      <div data-testid="Output-lexicon" className="Output_container">
        {results && results.length ? renderResults() : <></>}
      </div>
    </div>
  );
}

export default Output;