import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { UserInfo } from '../node_modules/@firebase/auth-types'
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Link = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [user,setUser] = useState<UserInfo | null>(null)
  const [signInStatus,setSignInStatus] = useState<string>('Please Sign in First')
  const [shouldPlaidOpen,setShouldPlaidOpen] = useState<boolean>(false)




  
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
      setLinkToken(null)
      console.log('acces',await accessTokenSave)
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  }, []);


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
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user: UserInfo = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        setUser(user)
        setSignInStatus('Link Accounts')
                
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




  const createLinkTokenV2 = async () => {
    try {
      const linkTokenCall = await fetch('/api/plaid-access',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          methodChoice: 'createLinkToken',
          products: ["assets","transactions"],
          jlbInvestmentsId: user
        })
      })

      const response = await linkTokenCall.json()

      setLinkToken(response.linkToken.link_token)

      setShouldPlaidOpen(true)
      
      console.log('LinkToken reponse',response)

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
  };

  

  const { open, ready, exit } = usePlaidLink(config);

  useEffect(()=>{
    if(ready){
      open()
    }

  },[ready,open])

  // Render the button once pubToken is available
  // if (!linkToken) {
  //   return <div>Loading...</div>; // Show a loading state while the token is being fetched
  // }

  return (
    <div>
      <button onClick={createLinkTokenV2} disabled={!user}>
        {`${signInStatus}`}
      </button>
      <button onClick={() => getBalances()}>
        Get Balances
      </button>
      <button onClick={() => firebaseLogin()}>
        Sign In
      </button>
    </div>
  );
};

export default Link;
