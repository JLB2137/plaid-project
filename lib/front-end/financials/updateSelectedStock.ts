import {useFinancialsContext } from "../../../context/FinancialsContext"
export default async function updateSelectedStock (ticker:string,timePeriod:string,timeInterval:string){
    console.log('getting here')
    const {getPricing, setStockPricing, stockPricing} = useFinancialsContext()
    const response = await getPricing(ticker,timePeriod,timeInterval)
    setStockPricing(response)
    console.log('stockPricing',stockPricing)
}