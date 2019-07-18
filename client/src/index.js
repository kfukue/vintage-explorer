import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import Wines from './page/wines/wines';
import Admin from './page/admin/admin';
import WineProducer from './page/wineProducer/wineProducer';
import User from './page/user/user';
const routing = (
  <Router>
    <div>
      <Route path="/" component={App} />
      <Route path="/admin" component={Admin} />
      <Route path="/wineProducers" component={WineProducer} />
      <Route path="/user" component={User} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
