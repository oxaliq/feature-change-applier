import React, { useState } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['one']);
  const [ phonemes, setPhonemes ] = useState(
    [ 
      { phoneme: [ 'feature' ] } 
    ]
  );

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features phonemes={phonemes} setPhonemes={setPhonemes}/>
    </div>
  );
}

export default PhonoChangeApplier;