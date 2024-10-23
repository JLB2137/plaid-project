import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { LinkToken } from "./types/types";
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Link = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [siteUserID,setSiteUserID] = useState<string | null>(null)

  const createLinkTokenV2 = async () => {
    try {
      const linkTokenCall = await fetch('/api/plaid-access',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          methodChoice: 'createLinkToken',
          products: ["assets","transactions"]
        })
      })

      const response = await linkTokenCall.json()

      setLinkToken(response.linkToken.link_token)
      
      console.log('LinkToken reponse',response)

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };


  
  const onSuccess: PlaidLinkOnSuccess = React.useCallback(async (public_token, metadata) => {
    console.log("Plaid public token received:", public_token);

    console.log('metadata',metadata)

    try {
      const accessTokenSave = await fetch('/api/plaid-access',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          methodChoice: 'getAccessToken',
          public_token: public_token,
        })
      })
      console.log('acces',await accessTokenSave)
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  }, []);

  // Fetch public token on mount
  useEffect(() => {
    const fetchToken = async () => {
      await createLinkTokenV2();

      //await getPublicToken(); // Fetch the public token and set it in state
    };

    fetchToken();
  }, []); // Empty dependency array ensures this only runs once on component mount

  //need to find a way to clean this up
  let config = {
    token: "",
    onSuccess,
  };
  // Plaid link configuration, only use pubToken after it is fetched
  if (linkToken) {
    config = {
      token: linkToken,
      onSuccess, 
    };
  } else {
    config = {
      token: "", 
      onSuccess, 
    };
  }

  console.log("linkToken", linkToken);
  const firebaseLogin = async () => {
    

    const firebaseConfig = {
      apiKey: 'AIzaSyCYYK43AFwmfljp0JeA3PajLePFv_tSYzU',
      authDomain: "jlb-investments.firebaseapp.com",
      projectId: "jlb-investments",
      storageBucket: "jlb-investments.appspot.com",
      messagingSenderId: "250755462166",
      appId: "1:250755462166:web:e60614c2b96091b828b137",
      measurementId: "G-SFR76BCE7B"
    };
    let app
    //check if app has already been initialized
    if(!getApps().length){
      app = await initializeApp(firebaseConfig);
    }else{
      app = getApps()[0]
    }

  //initialize auth
    const provider = new GoogleAuthProvider();
    const auth = getAuth()
    console.log('auth',auth)
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
  if (!linkToken) {
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
