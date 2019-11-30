import React from 'react';
import ReactDOM from 'react-dom';
import Output from './Output';
import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders Output without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Output />, div);
  ReactDOM.unmountComponentAtNode(div);
});



describe('Output', () => {
  it('renders the correct subtitle', () => {
    const { getByTestId } = render(<Output />);
    expect(getByTestId('Output')).toHaveTextContent('Results of Run');
  });
  
  it('renders output lexicon list from output hook', () => {
    const { getByTestId } = render(<Output />);
    // expect(getByTestId('Output-list'));
  });

});