import { motion } from "framer-motion"
import consolidatedSecurityHoldings from "../../lib/front-end/plaid/consolidatedSecurityHoldings"
import DynamicInvestmentGrid from "./dynamicInvestmentGrid"
import securityHoldings from "../../lib/front-end/plaid/securityHoldingsMatch"
import { flexBoxItems } from "../../styles/constants"
import { usePlaidContext } from "../../context/PlaidContext"
import { useEffect, useState } from "react"


export const InvestmentGrid = () => {

  const [loading,setLoading] = useState<boolean>(true)

  const {investments} = usePlaidContext()

  useEffect(()=>{

    if(!investments?.holdings || !investments){
      setLoading(true)
    }else{
      setLoading(false)
    }

  },[investments])

    if(loading){
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    // }else if(investments.holdings.length==0){
    //   return (
    //     <div>
    //       <p>Your holdings don't exist, please link accounts</p>
    //     </div>
    //   )
    }else{
      console.log('investments',investments)
      let institutionalHoldings = []
      for(let i=0;i<investments!.holdings.length;i++){
        if(!investments!.holdings[i].error_code){
          institutionalHoldings.push(securityHoldings(investments!.holdings[i].holdings,investments!.holdings[i].securities))
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


