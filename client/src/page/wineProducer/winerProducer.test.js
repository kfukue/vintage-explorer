import React from 'react';
import ReactDOM from 'react-dom';
import WineProducer from './wineProducer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WineProducer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
