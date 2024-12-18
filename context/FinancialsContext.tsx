import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getDailyPricingClient, getCompanyFinancialsClient } from '../lib/api/stockInformation/getDailyPricing';
import { fetchHistoricalEarnings } from '../lib/api/stockInformation/SECHistoricals';
import { CIKData } from '../constants/CIK';

interface FinancialInformationContextProps {
    getPricing: (ticker:string,timePeriod:string,timeInterval:string) => Promise<void>;
    stockPricing: any
    setStockPricing: any
    ticker: string | undefined
    setTicker:any
    companyName: string | undefined
    setCompanyName:any
    selectedPrice: number | undefined
    setSelectedPrice:any
    initialRangePrice: number | undefined
    setInitialRangePrice:any
    stockFinancials: number | undefined
    setStockFinancials:any
}
const FinancialInformationContext = createContext<FinancialInformationContextProps | null >(null);

export function FinancialInformationProvider ({children}:{children: ReactNode}) {
    //should use session storage as I don't want this to be saved when the browser is shutdown
    const [stockPricing, setStockPricing] = useState(null) //needs typing
    const [stockFinancials, setStockFinancials] = useState(null) //needs typing
    const [ticker, setTicker] = useState<undefined | string>()
    const [companyName, setCompanyName] = useState<undefined | string>()
    const [selectedPrice, setSelectedPrice] = useState<undefined | string>()
    const [initialRangePrice, setInitialRangePrice] = useState<undefined | string>()
    //should add balances and such to this



    useEffect(()=> {
        getPricing('TSLA','1y','1d')
    },[])


    //this needs a failsafe for if the stock doesn't exist etc despite the internal api call working
    const getPricing = async (ticker:string,timePeriod:string,timeInterval:string)=> {

        const pricingResponse = await getDailyPricingClient(ticker,timePeriod,timeInterval)
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
        throw new Error("context is missing")
    }

    return context as FinancialInformationContextProps
}

