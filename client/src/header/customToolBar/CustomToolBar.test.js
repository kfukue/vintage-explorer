import React from 'react';
import ReactDOM from 'react-dom';
import CustomToolBar from './CustomToolBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CustomToolBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
