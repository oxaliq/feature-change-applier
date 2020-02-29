import React from 'react';
import './App.css';
import PhonoChangeApplier from './PhonoChangeApplier';

function App() {
  return (
    <div className="App" data-testid="App">
      <h1 data-testid="App-name">Feature Change Applier</h1>
      <PhonoChangeApplier />
    </div>
  );
}

export default App;
