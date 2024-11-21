import { createContext, ReactNode, useContext, useState } from 'react'
import { UserInfo } from '../node_modules/@firebase/auth-types'
import { GetBalancesResponse, InvestmentHoldingsApiResponse} from '../types/types'
import { getInvestmentHoldings as clientGetInvestments, getBalances as clientGetBalances} from '../lib/api/plaid/clientAccountApi'
import { User } from 'firebase/auth'
import {useAuth} from './AuthContext'

interface PlaidContextProps {
    investments: InvestmentHoldingsApiResponse | null;
    getInvestments: () => Promise<void>;
    balances: GetBalancesResponse[] | null;
    getBalances: () => Promise<void>;
}

const PlaidContext = createContext<PlaidContextProps | null >(null);

export function PlaidProvider ({children}:{children: ReactNode}) {
    //should use session storage as I don't want this to be saved when the browser is shutdown
    const [investments, setInvestments] = useState<InvestmentHoldingsApiResponse | null>(null)
    const [balances, setBalances] = useState<GetBalancesResponse[] | null>(null)
    const {user} = useAuth()


    const getInvestments = async () => {
        const holdings = await clientGetInvestments(user!)

        if(holdings){
            setInvestments(holdings)
        }

    }

    const getBalances = async () => {

        const accountBalances = await clientGetBalances(user!)

        if(accountBalances){
            setBalances(accountBalances)
        }
    }



    return (
        <PlaidContext.Provider value={{
            investments,
            getInvestments,
            balances,
            getBalances
            }}>
            {children}
        </PlaidContext.Provider>
    )



}

export function usePlaidContext(){
    const context = useContext(PlaidContext)
    if (context==null){
        throw new Error("context is missing")
    }

    return context as PlaidContextProps
}