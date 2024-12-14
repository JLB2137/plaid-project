import { useFinancialsContext } from "../../context/FinancialsContext"
import LineChart from "./chartingSetup"

export default function chartComponent() { //need to add stock as input here
    const {stockPricing} = useFinancialsContext()
    if(stockPricing){
      return (
        <div className="h-1/2 w-screen">
          <LineChart stockPricing={stockPricing} />
        </div>)
    }else{
      return <div>Loading Chart</div>
    }

  }