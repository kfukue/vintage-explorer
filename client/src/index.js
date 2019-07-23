import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import App from './App';
import Wines from './page/wines/wines';
import Admin from './page/admin/admin';
import WineProducer from './page/wineProducer/wineProducer';
import User from './page/user/user';
import CustomToolBar from "./header/customToolBar/CustomToolBar.js";
const routing = (
    <div>
  <Router>
    <Switch>
      <Route path="/" layout={CustomToolBar} component={App} />
     </Switch>
  </Router>
    </div>
)
ReactDOM.render(<App /> , document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
