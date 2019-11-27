import React, { useState } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['one'])

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features />
    </div>
  );
}

export default PhonoChangeApplier;