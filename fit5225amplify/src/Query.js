import {API, Auth} from "aws-amplify";
import React, {useEffect, useState} from "react";
import {AmplifyAuthenticator, AmplifySignIn, AmplifySignOut, AmplifySignUp} from "@aws-amplify/ui-react";





function Query() {
    const [inputList, setInputList] = useState([{ tagValue : "" }]);
    const [resultData, setResultData] = useState({});

    async function setResult(data){
        setResultData(data)
    }

    // handle input change
    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const list = [...inputList];
        list[index]["tagValue"] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { tagValue: "" }]);
    };

    async function callApi() {
        try {
            let tagsList = {};
            for (let i = 0; i<inputList.length; i++){
                if (!inputList[i]["tagValue"].length <= 0) {
                    tagsList["tag".concat(i + 1)] = inputList[i]["tagValue"];
                }
            }



            const QueryData = await API.get('fit5225a2api', '/query', {
                headers: {
                    Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                },
                'queryStringParameters': tagsList
            }).then(
                (result) =>{
                    setResultData(result)
                }
            );
        } catch (err) {
            console.log({err})
        }
    }
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





            <div className="App">

                {inputList.map((x, i) => {
                    return (
                        <div className="box">
                            <input
                                placeholder="Enter tag value"
                                value={x.tagValue}
                                onChange={e => handleInputChange(e, i)}
                            />
                            <div className="btn-box">
                                {inputList.length !== 1 && <button
                                    className="mr10"
                                    onClick={() => handleRemoveClick(i)}>Remove</button>}
                                {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
                            </div>
                        </div>
                    );
                })}
                <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
                <button onClick={callApi}>Submit</button>
            </div>


            <div style={{ marginTop: 20 }}>{JSON.stringify(resultData)}</div>





            <AmplifySignOut/>
        </AmplifyAuthenticator>

    )
}





export default Query;