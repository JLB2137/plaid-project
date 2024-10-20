import { NextApiRequest, NextApiResponse } from "next";

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest, res:NextApiResponse): Promise<void> {   
        try {
            const public_token =  await fetch(`https://${process.env.PLAID_PLAID_PLAID_ENV_URL}/sandbox/public_token/create`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "PLAID_CLIENT_ID": `${process.env.PLAID_CLIENT_ID}`,
                    "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
                    "institution_id": "ins_20",
                    "initial_products": ["auth"],
                    "options": {
                        "webhook": "https://www.genericwebhookurl.com/webhook"
                    }
                })
                }
            )

            let result = await public_token.json()

            console.log('resultofPublic Token',result)

            res.status(200).json({ public_token: result });
        }
            
        catch(error){
            console.log(error)
        }

}