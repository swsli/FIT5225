import React from "react";
import {Storage} from "aws-amplify";
import Authenticator from "aws-amplify-react";
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut, AmplifySignIn, withAuthenticator } from '@aws-amplify/ui-react';


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
            <AmplifyAuthenticator usernameAlias="email" initialAuthState="signup">
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
                <AmplifySignIn  slot="sign-in" usernameAlias="email" />
                <div>
                    <input
                        type="file" accept='image/jpeg'
                        onChange={(evt) => this.onChange(evt)}
                    />
                </div>
                <AmplifySignOut/>
            </AmplifyAuthenticator>

        )
    }
}

export default Upload;