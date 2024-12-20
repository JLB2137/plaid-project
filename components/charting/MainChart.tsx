import { useFinancialsContext } from "../../context/FinancialsContext"
import { numberFormatting } from "../../lib/front-end/numberTextFormatting"
import LineChart from "./MainChartConfig"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import {motion} from 'framer-motion'

export default function MainChart() { //need to add stock as input here
    const {stockPricing, stockBalance, stockIncome, stockCashFlow, companyName,selectedPrice, initialRangePrice} = useFinancialsContext()
    const PercentageArrow = () => {
      if(initialRangePrice!>=selectedPrice!){
      return (
        <div className="flex">          
          <ChevronDownIcon className="size-6 text-red font-bold"/>
          <h2 className="text-left text-red font-bold">
              ${numberFormatting(selectedPrice!-initialRangePrice!)} ({numberFormatting((selectedPrice!-initialRangePrice!)/initialRangePrice!*100)}%)
            </h2>
        </div>
      )
         
      }else{
        return (
          <div className="flex">          
            <ChevronUpIcon className="size-6 text-green font-bold"/>
            <h2 className="text-left text-green font-bold">
              ${numberFormatting(selectedPrice!-initialRangePrice!)} ({numberFormatting((selectedPrice!-initialRangePrice!)/initialRangePrice!*100)}%)
            </h2>
          </div>
        )
      }
    }
    
    if(stockPricing && stockBalance && stockIncome && stockCashFlow){
      return (
        <div className="w-7/12 flex-col items-center">
          <h2 className="text-left text-2xl">{companyName}</h2>
          <motion.div></motion.div>
          <h2 className="text-left text-lg">${numberFormatting(selectedPrice!)}</h2>
          <PercentageArrow/>
          <div className="w-full h-3/4">
            <LineChart />
          </div>
        </div>)
    }else{
      return <div>Charting...</div> //return here to add animation
    }

  }