import React from 'react';
import ReactDOM from 'react-dom';
import Features from './Features';
import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders Features without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Features />, div);
  ReactDOM.unmountComponentAtNode(div);
});



describe('Features', () => {
  it('renders the correct subtitle', () => {
    const { getByTestId } = render(<Features />);
    expect(getByTestId('Features')).toHaveTextContent('Phonetic Features');
  });
  
  it('renders features from phonemes hook', () => {
    const nPhone = {n:{ 
      grapheme: 'n', 
      features: { nasal: true, occlusive: true, vowel: false } }} 
    const { getByTestId } = render(<Features phones={{nPhone}} 
      features={{
        nasal: {positive: [nPhone.n], negative: []}, 
        occlusive:{ positive: [nPhone.n], negative:[]}, 
        vowel:{positive: [], negative: [nPhone.n]} 
      }}
    />);
    
    expect(getByTestId('Features-list'))
      .toContainHTML('<ul class="Features__list" data-testid="Features-list"><li><span class="plus-phones">[+ nasal] = n</span><span class="minus-phones">[- nasal] = </span></li><li><span class="plus-phones">[+ occlusive] = n</span><span class="minus-phones">[- occlusive] = </span></li><li><span class="plus-phones">[+ vowel] = </span><span class="minus-phones">[- vowel] = n</span></li></ul>');
  });
});