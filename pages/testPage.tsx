import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { LinkToken } from "./types/types";
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseAppStartup from './api/firebase-config'

const Link = () => {
  const [pubToken, setPubToken] = useState<string | null>(null); // Store the public token
  const [linkToken, setLinkToken] = useState<LinkToken | null>(null);
  const [accountIds,setAccountIds] = useState<{} | null>(null)

  //currently input methods have no effect on apis
  const createLinkToken = async () => {
    const response = await fetch("/api/get-link-token", {});

    const data = await response.json();
    console.log("found response status LINK", response.status);
    console.log("found response status LINK", data!.link_token);
    setLinkToken(data.link_token);
    console.log("LINK", linkToken);
    return;
  };

  // Function to fetch public token
  const getPublicToken = async () => {
    const response = await fetch("/api/public-token-exchange", {});
    console.log("Response status:", response.status); // Log status

    if (!response.ok) {
      console.error("Failed to fetch public token");
      return null;
    }

    const data = await response.json();
    console.log("Public token data:", data.public_token); // Log data after parsing
    setPubToken(data.public_token);
    return data.public_token;
  };

  // Callback function that runs after Plaid's link is successful
  const onSuccess: PlaidLinkOnSuccess = React.useCallback(async (public_token, metadata) => {
    console.log("Plaid public token received:", public_token);

    console.log('metadata',metadata)

    try {
      const dbRoute = await fetch('/api/get-db-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({metadata})
      })
      const newData = await dbRoute.json()
      console.log("Access token received:", newData); // Log access token
      // You can store the access token in the state if needed
      return;
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  }, []);

  const getBalances = async() => {
    //need to check if pub token is null before

    try {
      const access_key = await fetch("/api/access-token-exchange", {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ pubToken }),
      });
      let access_token_response = await access_key.json()
      let access_token = access_token_response.access_token_response.access_token
      console.log('accessToken',access_token)

      const get_accounts = await fetch("/api/get-account-ids",{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ access_token }),
      })
      let account_id_response = await get_accounts.json()
      let account_ids = account_id_response.account_id_response.accounts
      console.log('account_id_response',account_ids)
    
      //will need to be setup to be adjusted by front-end
      const accounts = [account_ids[0].account_id,account_ids[1].account_id]
      const balances = await fetch('/api/get-balance',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          access_token: access_token,
          accounts: accounts,

        })
      })
      let newData = await balances.json()
      console.log("BALANCES:", newData); // Log access token
      // You can store the access token in the state if needed
      const transactions = await fetch('/api/get-transactions',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          access_token: access_token,

        })
      })
      newData = await transactions.json()
      console.log("TRANSACTIONS:", newData); // Log access token
      return;
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  // Fetch public token on mount
  useEffect(() => {
    const fetchToken = async () => {
      await createLinkToken();
      await getPublicToken(); // Fetch the public token and set it in state
    };

    fetchToken();
  }, []); // Empty dependency array ensures this only runs once on component mount

  let config = {
    token: "", // Use the public token to initialize Plaid Link
    onSuccess,
  };
  // Plaid link configuration, only use pubToken after it is fetched
  if (linkToken) {
    config = {
      token: linkToken?.link_token, // Use the public token to initialize Plaid Link
      onSuccess, // onSuccess is the callback that will handle token exchange
    };
  } else {
    config = {
      token: "", // Use the public token to initialize Plaid Link
      onSuccess, // onSuccess is the callback that will handle token exchange
    };
  }

  console.log("here", pubToken);
  console.log("linkToken", linkToken);
  const firebaseLogin = async () => {

    
    const app = await firebaseAppStartup()
    console.log('app',app)

  //initialize auth
    const provider = new GoogleAuthProvider();
    const auth = await getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log('user',user)
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  



  }



  const { open, ready, exit } = usePlaidLink(config);

  // Render the button once pubToken is available
  if (!pubToken) {
    return <div>Loading...</div>; // Show a loading state while the token is being fetched
  }

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        Link account
      </button>
      <button onClick={() => getBalances()} disabled={!ready}>
        Get Balances
      </button>
      <button onClick={() => firebaseLogin()} disabled={!ready}>
        Sign In
      </button>
    </div>
  );
};

export default Link;
