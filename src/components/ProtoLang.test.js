import React from 'react';
import ReactDOM from 'react-dom';
import ProtoLang from './ProtoLang';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProtoLang />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('ProtoLang', () => {
  it('renders the correct title', () => {
    const { getByTestId } = render(<ProtoLang />);
    expect(getByTestId('ProtoLang')).toHaveTextContent('Proto Language Lexicon');
  })
})