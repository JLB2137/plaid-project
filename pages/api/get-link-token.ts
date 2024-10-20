import { NextApiRequest, NextApiResponse } from "next";

// pages/api/user/[id].js
export default async function handler(req: NextApiRequest, res:NextApiResponse): Promise<void> {   
    // Account filtering isn't required here, but sometimes 
// it's helpful to see an example. 

const request = 
    {
        "PLAID_CLIENT_ID": `${process.env.PLAID_CLIENT_ID}`,
        "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
        "client_name": "JLB Investment Dashboard",
        "country_codes": ["US"],
        "language": "en",
        "user": {
            "client_user_id": `${process.env.user_id}`
        },
            "products": ["assets"]
    }
    
const tokenFetch = await fetch(`https://${process.env.PLAID_PLAID_PLAID_ENV_URL}/link/token/create`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
})

try {

const response = await tokenFetch.json();
console.log("linkTOKEN",response,'\n','\n','\n')
res.status(200).json({link_token: response})
}

catch(error){
    console.log(error)
}

}