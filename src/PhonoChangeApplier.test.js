import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PhonoChangeApplier from './PhonoChangeApplier';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders PhonoChangeApplier without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PhonoChangeApplier />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {
  it('renders Proto Language Lexicon', () => {
    const { getByTestId } = render(<PhonoChangeApplier />);
    expect(getByTestId('PhonoChangeApplier')).toHaveTextContent('Proto Language Lexicon');
  })
})