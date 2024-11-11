import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Plaid } from "plaid-link";
import { UserInfo } from '../node_modules/@firebase/auth-types'
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, signOut ,GoogleAuthProvider, browserLocalPersistence, setPersistence, onAuthStateChanged} from "firebase/auth";
import { InvestmentHoldingsResponse, InvestmentSecurity } from "./types/types";
import { auth } from "firebase-admin";

const Link = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [user,setUser] = useState<UserInfo | null>(null)
  const [signInStatus,setSignInStatus] = useState<string>('Please Sign in First')
  const [shouldPlaidOpen,setShouldPlaidOpen] = useState<boolean>(false)
  const [investmentHoldings, setInvestmentHoldings] = useState<InvestmentHoldingsResponse | null>(null)
  
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
    app = initializeApp(firebaseConfig);
  }else{
    app = getApps()[0]
  }
  const provider = new GoogleAuthProvider();
  const auth = getAuth()
  setPersistence(auth,browserLocalPersistence)



  
  const onSuccess: PlaidLinkOnSuccess = async (public_token, metadata) => {
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
          metadata: metadata,
          jlbInvestmentsId: user

        })
      })
      setLinkToken(null)
      console.log('acces',await accessTokenSave)
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };


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

  const firebaseLogout = () => {
    signOut(auth)
    setUser(null)
    setSignInStatus('Please Sign in First')
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
          products: ["auth","transactions","investments","liabilities"],
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

  const getBalances = async ()=> {

    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'getBalance'
        })
      })

      const response = await request.json()

      
      console.log('returned accounts',response)

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
  }

  const getInvestmentHoldings = async ()=> {

    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'getInvestmentHoldings'
        })
      })

      const response = await request.json()

      //setup to display holdings

      //the zero here needs to be adjusted for multiple account tokens where the tokens are greater than 1 account

      setInvestmentHoldings(response.holdings[0])

      
      console.log('returned investment accounts',response)

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
  }

  const deleteAccount = async ()=> {
    //the accountID to delete will need to be passed and no longer be static
    try {
      const request = await fetch('/api/plaid-account-data',{
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          jlbInvestmentsId: user,
          method: 'deleteAccount',
          accountID: 'MA79bJeb9gcLMeRG5eqQUnbyKEmdMafLRlxnq'
        })
      })

      const response = await request.json()

      //setup to display holdings

      //the zero here needs to be adjusted for multiple account tokens where the tokens are greater than 1 account
      
      console.log('deleted account response',response)

    } catch (error) {
      console.error("error deleting account:", error);
    }
    
  }

  const displayInvestmentHoldings = () => {


  



    if(!investmentHoldings){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }
    else{
      console.log(investmentHoldings)
      const securities: { [x: string]: { name?: string; ticker?:string; closePrice?: number; costBasis?: number; quantity?: number}; } = {}

      for(let i=0; i<investmentHoldings!.securities.length;i++){
        securities[`${investmentHoldings!.securities[i].security_id}`] = {
          name: investmentHoldings!.securities[i].name,
          ticker: investmentHoldings!.securities[i].ticker_symbol!,
          closePrice: investmentHoldings!.securities[i].close_price!
  
        }
      }
      for(let i=0; i<investmentHoldings!.holdings.length;i++){
        securities[`${investmentHoldings!.holdings[i].security_id}`].costBasis = investmentHoldings!.holdings[i].cost_basis
        securities[`${investmentHoldings!.holdings[i].security_id}`].quantity = investmentHoldings!.holdings[i].quantity
      }
      return (
        <div>
          <ul>
        {
          Object.entries(securities).map(([key, value]) => (
            <li key={key}>
              <p>Asset Name: {value.name}</p>
              <p>Ticker: {value.ticker}</p>
              <p>Price: ${value.closePrice}</p>
              <p>Quantity Owned: {value.quantity}</p>
              <p>Market Value: ${value.quantity! * value.closePrice!}</p>
            </li>
  
          ))  
        }
          </ul>
        </div>
      )
    }


  }

  

  const { open, ready, exit } = usePlaidLink(config);

  useEffect(()=> {
    onAuthStateChanged(auth,(user) => {
      if(user){
        setUser(user)
        setSignInStatus('Link Accounts')
      }else{
        //user not signed in
      }
    })
  })
  
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
      <button onClick={() => getInvestmentHoldings()}>
        Get Investment Holdings
      </button>
      <button onClick={() => deleteAccount()}>
        Delete Account
      </button>
      <button onClick={() => firebaseLogin()} disabled={user !== null}>
        Sign In
      </button>
      <button onClick={() => firebaseLogout()} disabled={!user}>
        Sign Out
      </button>
      {displayInvestmentHoldings()}
    </div>
  );
};

export default Link;
