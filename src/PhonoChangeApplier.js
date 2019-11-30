import React, { useState } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';
import Features from './components/Features';
import Epochs from './components/Epochs';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['one']);
  const [ phonemes, setPhonemes ] = useState( 
      { phoneme: [ 'feature' ] } 
  );
  const [ epochs, setEpochs ] = useState([{name: 'epoch 1', changes:['[+ feature]>[+ new feature]/[]_[]']}]);

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
      <Features phonemes={phonemes} setPhonemes={setPhonemes}/>
      <Epochs epochs={epochs} setEpochs={setEpochs}/>
    </div>
  );
}

export default PhonoChangeApplier;