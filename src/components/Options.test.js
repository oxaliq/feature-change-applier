import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import renderer from 'react-test-renderer';
import {render, fireEvent} from '@testing-library/react';
import extendExpect from '@testing-library/jest-dom/extend-expect'

it('renders Options without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Options />, div);
  ReactDOM.unmountComponentAtNode(div);
});



describe('Options', () => {
  it('renders the correct subtitle', () => {
    const { getByTestId } = render(<Options />);
    expect(getByTestId('Options')).toHaveTextContent('Modeling Options');
  });

});