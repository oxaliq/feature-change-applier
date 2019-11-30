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
    const { getByTestId } = render(<Features phonemes={ {n:[ 'nasal', 'occlusive' ]} }/>);
    expect(getByTestId('Features-list')).toContainHTML('<li>[+ nasal] = n</li><li>[+ occlusive] = n</li>');
  });

  // it('adds new features and new phonemes from features and newPhonemes hooks', () => {
  //   const { getByTestId } = render(<Features />);
  //   getByTestId('Features-form')
  // })

  // it('adds features from form to hooks', () => {
  //   const phonemes = [];
  //   const setPhonemes = jest.fn()
  //   const { getByTestId } = render(<Features phonemes={phonemes} setPhonemes={setPhonemes}/>);
  //   // mock function for adding feature to state ([+ nasal] = n)
    
  //   expect(getByTestId('Features-list')).toContainHTML('<li>[+ nasal] = n</li>');
  // })
});