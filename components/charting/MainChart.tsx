import { useFinancialsContext } from "../../context/FinancialsContext"
import { numberFormatting } from "../../lib/front-end/numberTextFormatting"
import LineChart from "./MainChartConfig"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import {motion} from 'framer-motion'
import { PercentageArrow } from "./pricingMeasurements"
import { useState } from "react"

export default function MainChart() { //need to add stock as input here
    const {stockPricing, stockBalance, stockIncome, stockCashFlow, companyName} = useFinancialsContext()
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)
    const [initialRangePrice, setInitialRangePrice] = useState<number | undefined>(undefined)
    
    if(stockPricing && stockBalance && stockIncome && stockCashFlow){
      return (
        <div className="w-7/12 flex-col items-center">
          <h2 className="text-left text-2xl">{companyName}</h2>
          <motion.div></motion.div>
          <h2 className="text-left text-lg">${numberFormatting(selectedPrice!)}</h2>
          <PercentageArrow selectedPrice={selectedPrice} initialRangePrice={initialRangePrice}/>
          <div className="w-full h-3/4">
            <LineChart setSelectedPrice={setSelectedPrice} setInitialRangePrice={setInitialRangePrice}/>
          </div>
        </div>)
    }else{
      return <div>Charting...</div> //return here to add animation
    }

  }