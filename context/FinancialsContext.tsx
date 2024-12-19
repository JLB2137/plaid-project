import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getDailyPricingClient, getCompanyFinancialsClient } from '../lib/api/stockInformation/getDailyPricing';
import { fetchHistoricalEarnings } from '../lib/api/stockInformation/SECHistoricals';
import { CIKData } from '../constants/CIK';
import { ChartData } from '../types/types';

interface FinancialInformationContextProps {
    getPricing: (ticker:string,timePeriod:string,timeInterval:string) => Promise<void>
    stockPricing: ResponseType | undefined;
    setStockPricing: React.Dispatch<React.SetStateAction<ResponseType | undefined>>
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
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)
    const [initialRangePrice, setInitialRangePrice] = useState<number | undefined>(undefined)
    //should add balances and such to this



    useEffect(()=> {
        getPricing('TSLA','1y','1d')
    },[])


    //this needs a failsafe for if the stock doesn't exist etc despite the internal api call working
    const getPricing = async (ticker:string,timePeriod:string,timeInterval:string)=> {

        const pricingResponse: ResponseType = await getDailyPricingClient(ticker,timePeriod,timeInterval)
        //need conditional
        //console.log('resposnme fpr mna',pricingResponse)
        if(pricingResponse.apiResponse){
          setStockPricing(pricingResponse)
          setTicker(ticker)
          setCompanyName(pricingResponse.apiResponse[0].meta.longName)
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
            setStockFinancials
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

