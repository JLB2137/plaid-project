import { AuthProvider } from "../context/AuthContext";
import { PlaidProvider } from "../context/PlaidContext";
import { FinancialInformationProvider } from "../context/FinancialsContext";
import { AppProps } from "next/app";
import '../styles/global.css'

function JLBinvestments({Component, pageProps}: AppProps){
    return(
        <AuthProvider>
            <PlaidProvider>
                <FinancialInformationProvider>
                    <Component {...pageProps} className="font-sans"/>
                </FinancialInformationProvider>
            </PlaidProvider>
        </AuthProvider>
    )
}

export default JLBinvestments