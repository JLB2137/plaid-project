import { createContext, ReactNode, useContext, useState } from 'react'
import { UserInfo } from '../node_modules/@firebase/auth-types'
import {InvestmentHoldingsResponse} from '../types/types'

interface AppContextProps {
    signInStatus: string;
    setSignInStatus: (status:string) => void;
    user: UserInfo | null;
    setUser: (user:UserInfo | null) => void
    investmentHoldings: InvestmentHoldingsResponse | null
    setInvestmentHoldings: (holdings:InvestmentHoldingsResponse | null) => void
}

const AppContext = createContext<AppContextProps | null >(null);

export function AppWrapper ({children}:{children: ReactNode}) {


    return (
        <AppContext.Provider value={{
            signInStatus, setSignInStatus,
            user, setUser,
            investmentHoldings, setInvestmentHoldings
            }}>
            {children}
        </AppContext.Provider>
    )



}

export function useAppContext(){
    const context = useContext(AppContext)
    if (context==null){
        throw new Error("context is missing")
    }

    return context as AppContextProps 
}