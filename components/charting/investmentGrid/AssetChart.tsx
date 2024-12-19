import { useEffect, useState } from "react"
import LineChart from "./AssetChartConfig"
import { getDailyPricingClient } from "../../../lib/api/stockInformation/getDailyPricing"
import { ChartData, PricingErrorResponse } from "../../../types/types"


export default function IndividualChartComponent(props) { //need to add stock as input here
    const [loading,setLoading] = useState<boolean>(true)
    const [chartPricing,setChartPricing] = useState<undefined | ChartData | PricingErrorResponse>(undefined) //needs typing based on pricing response
    
    useEffect(()=> {
      const fetchPricing = async () => {
        try{
          const pricingResponse: ChartData | PricingErrorResponse = await getDailyPricingClient(props.ticker,'1y','1d')
          setChartPricing(pricingResponse)  
          //console.log('pricingResponse',pricingResponse)

        }catch(error){
          console.log('Error Grabbing Pricing From Client-Side API',error)
        }finally{
          setLoading(false)
        }

      }

      fetchPricing()
       
    },[])

    if(!loading){
      return <LineChart  pricing={chartPricing}/>
    }else{
      return <div>Loading Asset Chart</div>
    }

  }