import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { API, Storage, Auth } from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn, withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter as Router,
    Switch,
    Route,
    Link} from 'react-router-dom'
import Upload from "./Upload";
import Query from "./Query";
import Home from "./Home";
import SignIn from "./SignIn"





function App() {
  return (
          <Router>
              <li><Link to="/">Home page</Link></li>
              <li><Link to="/upload">Upload a image</Link></li>
              <li><Link to="/query">Query</Link></li>
              <li><Link to="/signin">Sign in</Link></li>
              <Switch>
                  <Route exact path={"/"}>
                      <Home/>
                  </Route>
                  <Route path={"/upload"}>
                      <Upload/>
                  </Route>
                  <Route path={"/query"}>
                      <Query/>
                  </Route>
                  <Route path={"/signin"}>
                      <SignIn/>
                  </Route>
              </Switch>
          </Router>
  );
}




export default App;