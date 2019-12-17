import React from 'react';
import ReactDOM from 'react-dom';
import ProtoLang from './ProtoLang';
import renderer from 'react-test-renderer';
import { exportAllDeclaration } from '@babel/types';
import {render, fireEvent} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders ProtoLang without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProtoLang />, div);
  ReactDOM.unmountComponentAtNode(div);
});


describe('ProtoLang', () => {
  it('renders the correct subtitle', () => {
    const { getByTestId } = render(<ProtoLang />);
    expect(getByTestId('ProtoLang')).toHaveTextContent('Proto Language Lexicon');
  });
  
  it('renders lexicon from state', () => {
    const { getByTestId } = render(<ProtoLang lexicon={[{ lexeme:'one', epoch:{name: 'epoch-one', changes: []} }]}/>);
    expect(getByTestId('ProtoLang-Lexicon')).toHaveFormValues({lexicon: 'one \t#epoch-one'});
  });
  
})