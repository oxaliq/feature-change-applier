import React from 'react';
import ReactDOM from 'react-dom';
import Epochs from './Epochs';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render, fireEvent} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders Epochs without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Epochs />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Epochs', () => {

  it('renders a suite of soundchanges', () => {
    const { getByTestId } = render(<Epochs />);
    
  })
});