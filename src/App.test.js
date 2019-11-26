import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {
  it('renders the correct title', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('App')).toHaveTextContent('Phono Change Applier');
  })
})