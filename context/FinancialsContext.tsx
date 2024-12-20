import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { clientPricing,clientIncome,clientBalance,clientCashflow } from '../lib/front-end/financials/FMP-API-Client';
import { ChartData } from '../types/types';

interface FinancialInformationContextProps {
    getPricing: (ticker:string,timePeriod:string,timeInterval:string) => Promise<void>
    stockPricing: ResponseType | undefined;
    setStockPricing: React.Dispatch<React.SetStateAction<ResponseType | undefined>>
    stockIncome: any
    setStockIncome: any
    stockBalance: any
    setStockBalance: any
    stockCashFlow: any
    setStockCashFlow: any
    ticker: string | undefined
    setTicker: React.Dispatch<React.SetStateAction<string | undefined>>
    companyName: string | undefined
    setCompanyName: React.Dispatch<React.SetStateAction<string | undefined>>
    selectedPrice: number | undefined
    setSelectedPrice: React.Dispatch<React.SetStateAction<number | undefined>>
    initialRangePrice: number | undefined
    setInitialRangePrice: React.Dispatch<React.SetStateAction<number | undefined>>
    stockFinancials: number | undefined //will need to be updated after route built
    setStockFinancials: React.Dispatch<React.SetStateAction<string | undefined>>
}

type ResponseType = {
    message: string,
    apiResponse?: ChartData["chart"]["result"],
    error?: ChartData["chart"]["error"],
}

type PricingResponse<ResponseType> = Promise<ResponseType>;
const FinancialInformationContext = createContext<FinancialInformationContextProps | null >(null);

export function FinancialInformationProvider ({children}:{children: ReactNode}) {
    //should use session storage as I don't want this to be saved when the browser is shutdown
    const [stockFinancials, setStockFinancials] = useState(null)
    const [ticker, setTicker] = useState<string | undefined>(undefined)
    const [companyName, setCompanyName] = useState<string | undefined>(undefined)
    const [stockPricing, setStockPricing] = useState<ResponseType | undefined>(undefined) 
    const [stockIncome, setStockIncome] = useState(undefined)
    const [stockBalance, setStockBalance] = useState(undefined)
    const [stockCashFlow, setStockCashFlow] = useState(undefined)
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)
    const [initialRangePrice, setInitialRangePrice] = useState<number | undefined>(undefined)
    //should add balances and such to this



    useEffect(()=> {
        getPricing('TSLA')
    },[])


    //this needs a failsafe for if the stock doesn't exist etc despite the internal api call working
    const getPricing = async (ticker:string)=> { //should be adjusted for start and end dates

        const pricingData = await clientPricing(ticker)
        //need conditional
        console.log('pricing resp Context',pricingData)
        const incomeData = await clientIncome(ticker)
        const balanceData = await clientBalance(ticker)
        const cashflowData = await clientCashflow(ticker)
        // console.log('incomeData',incomeData)
        // console.log('balanceData',balanceData)
        // console.log('cashflowData',cashflowData)
        if(pricingData){
          setStockPricing(pricingData.response.historical)
          setStockBalance(balanceData.response)
          setStockCashFlow(cashflowData.response)
          setStockIncome(incomeData.response)
          setTicker(ticker)
          setCompanyName(ticker) //needs to be adjusted with new API
        }
        
        //console.log('here')
        //const financialsResponse = await getCompanyFinancialsClient(ticker)
        //setStockFinancials(financialsResponse)
    }



    return (
        <FinancialInformationContext.Provider value={{
            getPricing,
            stockPricing,
            setStockPricing,
            ticker,
            setTicker,
            companyName,
            setCompanyName,
            selectedPrice,
            setSelectedPrice,
            initialRangePrice,
            setInitialRangePrice,
            stockFinancials,
            setStockFinancials,
            stockIncome,
            setStockIncome,
            stockBalance,
            setStockBalance,
            stockCashFlow,
            setStockCashFlow,
            }}>
            {children}
        </FinancialInformationContext.Provider>
    )



}

export function useFinancialsContext(){
    const context = useContext(FinancialInformationContext)
    if (context==null){
        throw new Error("Financial Context Error")
    }

    return context as FinancialInformationContextProps
}

