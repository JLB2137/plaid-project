import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
        //need to adjust this so it includes accounts

    const access_token:string | null = req.body.access_token
    let account_ids:string | null
    req.body.accounts? account_ids = req.body.accounts : account_ids=null
    console.log('accountIDs',account_ids)
        try {
            const balances = await fetch(`https://${process.env.PLAID_ENV_URL}/accounts/balance/get`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "client_id": `${process.env.PLAID_CLIENT_ID}`,
                    "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
                    "access_token":`${access_token}`,
                    "options": {
                      "account_ids": account_ids
                    }
                  })
              }
            )
    
            let result = await balances.json()
            console.log('result',result)
            res.status(200).json({result:result});
        }
            
        catch(error){
            res.status(500).json({error: error})
        }


}