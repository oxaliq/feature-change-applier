import React, { useState } from 'react';
import './PhonoChangeApplier.scss';

import ProtoLang from './components/ProtoLang';

const PhonoChangeApplier = () => {
  const [ lexicon, setLexicon ] = useState(['one'])

  return (
    <div className="PhonoChangeApplier" data-testid="PhonoChangeApplier">
      <ProtoLang lexicon={lexicon} setLexicon={setLexicon}/>
    </div>
  );
}

export default PhonoChangeApplier;