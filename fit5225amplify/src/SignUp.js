import {AmplifyAuthenticator, AmplifySignIn, AmplifySignUp} from "@aws-amplify/ui-react";
import React from "react";

function SignUp() {
    return(
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
        </AmplifyAuthenticator>
    );
}

export default SignUp;