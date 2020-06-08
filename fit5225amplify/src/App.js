import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { API, Storage } from 'aws-amplify'
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn, withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter as Router,
    Switch,
    Route,
    Link } from 'react-router-dom'


function App() {
  async function callApi() {
    try{
      const peopleData = await  API.get('mainappapi', '/people')
      console.log('peopleData:', peopleData)
    }catch(err){
      console.log({err})
    }
  }
  useEffect(() =>{
    callApi()
  }, [])
  return (
      // No idea how username get to work
      <AmplifyAuthenticator usernameAlias="email">
          <AmplifySignUp
              slot="sign-up"
              usernameAlias="email"
              formFields={[
                  {
                      type: "email",
                      label: "Email Address",
                      placeholder: "custom email placeholder",
                      required: true,
                  },
                  {
                      type: "password",
                      label: "Password",
                      placeholder: "custom password placeholder",
                      required: true,
                  },
                  {
                      type: "family_name",
                      label: "Family Name",
                      placeholder: "custom password placeholder",
                      required: true,
                  },
                  {
                      type: "given_name",
                      label: "Given Name",
                      placeholder: "custom password placeholder",
                      required: true,
                  },
              ]}
          />
          <AmplifySignIn slot="sign-in" usernameAlias="email" />
          <AmplifySignOut/>
          <Router>
              <li><Link to="/upload">Upload a image</Link></li>
              <li><Link to="/query">Query</Link></li>
              <Switch>
                  <Route path={"/upload"}>
                      <Upload />
                  </Route>
                  <Route path={"/query"}>
                      <Query />
                  </Route>
              </Switch>
          </Router>
      </AmplifyAuthenticator>
  );
}

function Query() {
    async function callApi() {
        try {
            const QueryData = await API.get('mainappapi', '/query', {
                'queryStringParameters': {
                    'tag1': 'person'
                }
            });
            console.log('peopleData:', QueryData)
        } catch (err) {
            console.log({err})
        }
    }

    useEffect(() => {
        callApi()
    }, [])
    return (
        <h1> Query</h1>
    )
}



class Upload extends React.Component {
    onChange(e) {
        const file = e.target.files[0];
        Storage.put(file.name, file, {
            // Solve multiple type
            contentType: "image/jpeg"
        })
            .then (result => console.log(result))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <input
                type="file" accept='image/jpeg'
                onChange={(evt) => this.onChange(evt)}
            />
        )
    }
}




export default App;