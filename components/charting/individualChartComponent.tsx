import { useFinancialsContext } from "../../context/FinancialsContext"
import { numberFormatting } from "../../lib/front-end/numberTextFormatting"
import LineChart from "./individualChartingSetup"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { getDailyPricingClient } from "../../lib/api/stockInformation/getDailyPricing"
import { useEffect, useState } from "react"

export default function IndividualChartComponent(props) { //need to add stock as input here
    const [loading,setLoading] = useState<boolean>(true)
    const [chartPricing,setChartPricing] = useState(undefined) //needs typing based on pricing response
    useEffect(()=> {
      const fetchPricing = async () => {
        try{
          const pricingResponse = await getDailyPricingClient(props.ticker,'1y','1d')
          setChartPricing(pricingResponse)  
          //console.log('pricingResponse',pricingResponse)

        }catch(error){
          console.log('error on charting call',error)
        }finally{
          setLoading(false)
        }

      }

      fetchPricing()
       
    },[])

    if(!loading){
      return <LineChart  pricing={chartPricing}/>
    }else{
      return <div>Loading Chart</div>
    }

  }