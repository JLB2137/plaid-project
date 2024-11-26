import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { UserInfo } from '../node_modules/@firebase/auth-types'
import { GetBalancesResponse, InvestmentHoldingsApiResponse} from '../types/types'
import { 
    getInvestmentHoldings as clientGetInvestments, 
    getBalances as clientGetBalances,
    onSuccess as clientOnSuccess,
    initLinkToken as clientInitToken

} from '../lib/api/plaid/clientAccountApi'
import { getInvestmentsCache } from '../lib/api/mongo/clientMongoApi'
import { User } from 'firebase/auth'
import {useAuth} from './AuthContext'

interface PlaidContextProps {
    investments: InvestmentHoldingsApiResponse | null;
    getInvestments: () => Promise<void>;
    balances: GetBalancesResponse[] | null;
    getBalances: () => Promise<void>;
    initToken: () => Promise<void>;
    onSuccess: (public_token,metadata) => Promise<void>;
    linkToken: string | null
}

const PlaidContext = createContext<PlaidContextProps | null >(null);

export function PlaidProvider ({children}:{children: ReactNode}) {
    //should use session storage as I don't want this to be saved when the browser is shutdown
    const [investments, setInvestments] = useState<InvestmentHoldingsApiResponse | null>(null)
    const [balances, setBalances] = useState<GetBalancesResponse[] | null>(null)
    const {user,profileFirstName} = useAuth()
    const [linkToken, setLinkToken] = useState<string | null>(null);

    //should add balances and such to this
    useEffect(()=> {
        const cacheImport = async () => {
            if(user){
                setInvestments(await getInvestmentsCache(user))
            }
        }
        cacheImport()
    },[profileFirstName])


    const getInvestments = async () => {
        const holdings = await clientGetInvestments(user!)

        if(holdings){
            setInvestments(holdings)
        }

        console.log(investments)

    }

    const getBalances = async () => {

        const accountBalances = await clientGetBalances(user!)
        if(accountBalances){
            setBalances(accountBalances.accounts)
        }
    }

    const initToken = async () => {
        const tokenResponse = await clientInitToken(user!)
        setLinkToken(tokenResponse.linkToken.link_token)
    }

    const onSuccess = async (public_token,metadata)=> {
        await clientOnSuccess(public_token,metadata,user)
        setLinkToken(null)
    }



    return (
        <PlaidContext.Provider value={{
            investments,
            getInvestments,
            balances,
            getBalances,
            onSuccess,
            initToken,
            linkToken
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