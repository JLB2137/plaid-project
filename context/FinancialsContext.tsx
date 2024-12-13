import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getDailyPricing } from '../lib/api/stockInformation/getDailyPricing';

interface FinancialInformationContextProps {
    getPricing: (ticker:string,timePeriod:string,timeInterval:string) => Promise<void>;
    stockPricing: any
    setStockPricing: any
}

const FinancialInformationContext = createContext<FinancialInformationContextProps | null >(null);

export function FinancialInformationProvider ({children}:{children: ReactNode}) {
    //should use session storage as I don't want this to be saved when the browser is shutdown
    const [stockPricing, setStockPricing] = useState(null) //needs typing

    //should add balances and such to this
    useEffect(()=> {
        getPricing('TSLA','1y','1d')
    },[])


    //this needs a failsafe for if the stock doesn't exist etc despite the internal api call working
    const getPricing = async (ticker:string,timePeriod:string,timeInterval:string)=> {

        const response = await getDailyPricing(ticker,timePeriod,timeInterval)
        setStockPricing(response)
        //console.log('here')
      }



    return (
        <FinancialInformationContext.Provider value={{
            getPricing,
            stockPricing,
            setStockPricing
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