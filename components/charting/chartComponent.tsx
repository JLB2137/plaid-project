import { useFinancialsContext } from "../../context/FinancialsContext"
import { numberFormatting } from "../../lib/front-end/numberTextFormatting"
import LineChart from "./chartingSetup"
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

export default function chartComponent() { //need to add stock as input here
    const {stockPricing, companyName,selectedPrice, initialRangePrice, stockFinancials} = useFinancialsContext()
    const arrow = () => {
      if(initialRangePrice!>=selectedPrice!){
        return <ChevronDownIcon className="size-6 text-red font-bold"/>
      }else{
        return <ChevronUpIcon className="size-6 text-green font-bold"/>
      }
    }
    
    if(stockPricing){
      return (
        <div className="w-7/12 flex-col items-center">
          <h2 className="text-left">{companyName}</h2>
          <h2 className="text-left">{numberFormatting(selectedPrice)}</h2>
          <div></div>
          {arrow()}
          <h2 className="text-left">{numberFormatting((selectedPrice-initialRangePrice)/initialRangePrice*100)}%</h2>
          <div className="w-full h-3/4">
            <LineChart pricing={stockPricing}/>
          </div>
        </div>)
    }else{
      return <div>Loading Chart</div>
    }

  }