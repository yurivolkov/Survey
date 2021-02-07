import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { unregister } from 'serviceWorker';
import store from 'store';
import App from './App';
import 'plugins';
import 'styles/main.css';
import 'moment/locale/tr';

require('dotenv').config()

unregister();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>, document.getElementById('root'));