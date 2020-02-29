import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders App without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><App /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {
  it('renders the correct title', () => {
    const { getByTestId } = render(<Router><App /></Router>);
    expect(getByTestId('App-name')).toHaveTextContent('Feature Change Applier');
  })
})