import React, { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import {usePlaidContext} from '../context/PlaidContext'
import { usePlaidLink } from "react-plaid-link";
import { UserInfo } from '../node_modules/@firebase/auth-types'
import { PlaidLinkOnSuccess } from "react-plaid-link";
import { InvestmentHoldingsResponse } from "../types/types";
import InvestmentCard from "../components/investmentCard";
import '../styles/Home.module.css'


export default function Link() {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const {user,popUpLogin,logout} = useAuth()

  const {getInvestments, investments, getBalances, balances} = usePlaidContext()

  //console.log('user',user)
  

  
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
      console.log('acces', accessTokenSave)
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



//add to the plaid context
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
      
      console.log('LinkToken reponse',response)

    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
    
  };




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
          accountID: "ZvazeJlqmvHN9lwGyNA6Idw8aLmG6zueaZVQy"
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

    if(!investments){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }
    else{
      const securities: { [x: string]: { name?: string; ticker?:string; closePrice?: number; costBasis?: number; quantity?: number}; } = {}
      for(let k = 0;k<investments!.holdings.length;k++){
        
        let accounts = investments!.holdings[k]
        if(accounts!.securities){
          console.log('accounts',accounts)
          for(let i=0; i<accounts!.securities.length;i++){
            //console.log('accounts',accounts.securities[i])
            securities[`${accounts!.securities[i].security_id}`] = {
              name: accounts!.securities[i].name,
              ticker: accounts!.securities[i].ticker_symbol!,
              closePrice: accounts!.securities[i].close_price!
      
            }
          }
          for(let i=0; i<accounts!.holdings.length;i++){
            //console.log('here',securities[`${accounts!.holdings[i].security_id}`])
            //console.log('here2',accounts!.holdings[i].cost_basis)
            securities[`${accounts!.holdings[i].security_id}`].costBasis = accounts!.holdings[i].cost_basis
            securities[`${accounts!.holdings[i].security_id}`].quantity = accounts!.holdings[i].quantity
          }
        }

      }
        console.log('securities',securities)
        
        return (
          <div className="flex flex-wrap w-screen">
            {Object.entries(securities).map(([key, value]) => (
                <InvestmentCard key={key} investments={value}></InvestmentCard>
      
              ))
          }
        </div>
        )

  }
}

  

  const { open, ready, exit } = usePlaidLink(config);
  
  useEffect(()=>{
    if(ready){
      open()
    }

  },[ready,open])

  useEffect(()=>{
    if(balances){
      console.log('balances',balances)
    }else if(investments){
      console.log('investments',investments)
    }
  },[balances,investments])

  // Render the button once pubToken is available
  // if (!linkToken) {
  //   return <div>Loading...</div>; // Show a loading state while the token is being fetched
  // }

  return (
    <div>
      <button onClick={createLinkTokenV2} disabled={!user}>
        Link Accounts
      </button>
      <button onClick={getBalances}>
        Get Balances
      </button>
      <button onClick={getInvestments}>
        Get Investment Holdings
      </button>
      <button onClick={() => deleteAccount()}>
        Delete Account
      </button>
      <button onClick={popUpLogin} disabled={user !== null}>
        Sign In
      </button>
      <button onClick={logout} disabled={!user}>
        Sign Out
      </button>
      {displayInvestmentHoldings()}
    </div>
  );
};
