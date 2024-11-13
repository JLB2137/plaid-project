import { AuthProvider } from "../context/AuthContext";
import { PlaidProvider } from "../context/PlaidContext";
import { AppProps } from "next/app";
//add styles here if needed

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