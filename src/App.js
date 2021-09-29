import { Auth, Hub } from "aws-amplify";
import React, { useEffect, useState } from "react";
import awsConfiguration from './aws-exports';

// awsConfiguration.oauth.redirectSignIn = 'https://master.d3argnuplyf2bl.amplifyapp.com/';
// awsConfiguration.oauth.redirectSignOut = 'https://master.d3argnuplyf2bl.amplifyapp.com/';

Auth.configure(awsConfiguration);

function App() {
  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          getAuthenticatedUserData();
          break;
        case "signOut":
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data); //TODO - will remove it once id.me flow is fine
          break;
      }
    });
    getAuthenticatedUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userData, setuserData] = useState(null);

  const getAuthenticatedUserData = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        if(user.attributes) {
          setuserData(user.attributes);
        }
      })
      .catch(() => {});
  };

  return (
    <div className="App">
      {userData && Object.keys(userData).map((key) => <><div>{key} - {userData[key]}</div></>)}
      {!userData &&  <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
        Google Sign in
      </button>}
     
    </div>
  );
}

export default App;
