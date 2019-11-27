import React from 'react';
import ReactDOM from 'react-dom';
import Features from './Features';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render} from '@testing-library/react';
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
  })
  
  // it('renders lexicon from state', () => {
  //   const { getByTestId } = render(<Features />);
  //   expect(getByTestId('Features'));
  // })
})