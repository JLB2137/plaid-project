import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { UserInfo } from '@firebase/auth-types'
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { initializeApp, getApps } from "firebase/app";
import 
{ getAuth, signInWithPopup, signOut ,GoogleAuthProvider, 
  browserLocalPersistence, setPersistence, onAuthStateChanged
} 
from "firebase/auth";
import { InvestmentHoldingsResponse } from "../types/types";

const Link = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [user,setUser] = useState<UserInfo | null>(null)
  const [signInStatus,setSignInStatus] = useState<string>('Please Sign in First')
  const [shouldPlaidOpen,setShouldPlaidOpen] = useState<boolean>(false)
  const [investmentHoldings, setInvestmentHoldings] = useState<InvestmentHoldingsResponse | null>(null)
  


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
          accountID: "QxwLZbjjrAcVv4a13VqPT4EM7B8lKxtGoe7KE"
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
