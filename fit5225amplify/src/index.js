import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Query from './Query'
import Upload from './Upload'
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify'
import config from './aws-exports'
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {AmplifyAuthenticator, AmplifySignIn, AmplifySignOut, AmplifySignUp} from "@aws-amplify/ui-react";
Amplify.configure(config)
ReactDOM.render(
  <React.StrictMode>
      <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
