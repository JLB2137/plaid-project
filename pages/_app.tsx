import { AuthProvider } from "../context/AuthContext";
import { PlaidProvider } from "../context/PlaidContext";
import { AppProps } from "next/app";
import '../styles/global.css'

function JLBinvestments({Component, pageProps}: AppProps){
    return(
        <AuthProvider>
            <PlaidProvider>
                <Component {...pageProps}/>
            </PlaidProvider>
        </AuthProvider>
    )
}

export default JLBinvestments