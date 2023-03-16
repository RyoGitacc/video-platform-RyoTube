import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import {store,  persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios'
const root = ReactDOM.createRoot(document.getElementById('root'));

axios.defaults.baseURL="https://video-platform2023.herokuapp.com/api"
// axios.defaults.baseURL="http://localhost:8800/api"
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
     <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>
);


