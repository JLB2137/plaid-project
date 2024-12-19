import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import {usePlaidContext} from '../context/PlaidContext'
import {useFinancialsContext} from '../context/FinancialsContext'
import { usePlaidLink } from "react-plaid-link";
import DynamicInvestmentGrid from '../components/investmentGrid/dynamicInvestmentGrid'
import MainChart from "../components/charting/MainChart";
import {motion} from 'framer-motion'
import DynamicInvestmentGridHeaders from '../components/investmentGrid/dynamicInvestmentGridHeaders'
import AccountBalanceGrid from '../components/userAccounts/accountBalanceGrid'
import AccountBalanceGridHeaders from "../components/userAccounts/accountBalanceGridHeaders";
import balanceDesconstructor from "../lib/front-end/plaid/balanceDescontructor";
import securityHoldings from '../lib/front-end/plaid/securityHoldingsMatch'
import { useRouter } from "next/router";
import '../styles/Home.module.css'
import consolidatedSecurityHoldings from "../lib/front-end/plaid/consolidatedSecurityHoldings";
import { flexBoxItems, flexBoxScrollBars } from "../styles/constants";


export default function Dashboard() {



  const {user,popUpLogin,logout} = useAuth()

  const {getInvestments, investments, getBalances, balances,initToken,onSuccess,linkToken} = usePlaidContext()
  const {getPricing, stockPricing, ticker, setTicker} = useFinancialsContext()
  const [investmentBools,setInvestmentBools] = useState<{ [key: string]: boolean }>({})
  const [tickerInput,setTickerInput] = useState<string>('')
  const router = useRouter()
  //console.log('user',user)


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

  const cardUpdate = (key:string) => {
    console.log('key',key)
    if(!investmentBools[key]){
      setInvestmentBools((currentBools) =>({
          ...currentBools,
          [key]: true
        }))
    }else{
      setInvestmentBools((currentBools) =>({
        ...currentBools,
        [key]: false
      }))

    }


  } 

  const balanceGrid = () => {
    if(!balances){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }else{

      const accounts = balanceDesconstructor(balances)
      //console.log("accounts before",accounts)

      return(
        <motion.div
        key="balances grid"
        initial={{opacity: 0, y:50, maxHeight:"30%", overflow:"hidden"}}
        whileHover={{overflow:"auto", maxHeight: "100%"}}
        animate={{opacity: 1, y:0}}
        transition={{duration: .5, ease: "easeInOut"}}
        className={flexBoxItems+flexBoxScrollBars}
        >
          <AccountBalanceGridHeaders />
          {
          accounts.map((account) =>
            <AccountBalanceGrid account={account} />
            )
          
          }
        </motion.div>
        
      )

    }

  }

  const investmentGrid = () => {

    if(!investments?.holdings){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }else if(investments.holdings.length==0){
      return (
        <div>
          <p>Your holdings don't exist, please link accounts</p>
        </div>
      )
    }else{

      console.log('investments',investments)
      let institutionalHoldings = []
      for(let i=0;i<investments.holdings.length;i++){
        if(!investments.holdings[i].error_code){
          institutionalHoldings.push(securityHoldings(investments.holdings[i].holdings,investments.holdings[i].securities))
        }
        
      }
      console.log('institution',institutionalHoldings)
      let consolidatedHoldings = consolidatedSecurityHoldings(institutionalHoldings)
      console.log('consolidated',consolidatedHoldings)


        return (
          <motion.div
          key="investment grid"
          initial={{opacity: 0, y:50}}
          animate={{opacity: 1, y:0}}
          transition={{duration: .5, ease: "easeInOut"}}
          className={flexBoxItems+ 'mt-14'}
          >
            {Object.entries(consolidatedHoldings).map(([key, value]) => (
                <DynamicInvestmentGrid key={key} investment={value}/>
              ))
            }
          </motion.div>
        )

  }
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = (event.target.value)
    setTickerInput(value)

  }

  const submit = (event: React.KeyboardEvent<HTMLInputElement>)=> {
    if(event.key == 'Enter'){
      event.preventDefault()
      getPricing(tickerInput!,'1y','1d')
      setTickerInput('')

    }
  }



  const logOutRedirect = async () => {
    await logout()
    setTimeout(()=>{
      router.push('/')
    },100)
  }

  const { open, ready, exit } = usePlaidLink(config);

  
  useEffect(()=>{

    if(ready){
      open()
    }

  },[ready,open])

  useEffect(()=>{
  },[balances,stockPricing])

  // Render the button once pubToken is available
  // if (!linkToken) {
  //   return <div>Loading...</div>; // Show a loading state while the token is being fetched
  // }
//need to return         {investmentGrid()}
  return (
    <div>
      <button onClick={initToken} disabled={!user}>
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
      <button onClick={logOutRedirect} disabled={!user}>
        Sign Out
      </button>
      <button onClick={logOutRedirect} disabled={!user}>
        Sign Out
      </button>
      <input value={tickerInput} onChange={(event)=>handleInput(event)} onKeyDown={(event)=>submit(event)} />
      <div className="flex flex-wrap h-max justify-around px-2 py-6 gap-x-1 gap-y-10">
        <MainChart/>
        {balanceGrid()}

      </div>
    </div>
  );
};
