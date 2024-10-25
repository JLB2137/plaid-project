import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
      
      const access_token = req.body.access_token
       console.log('actually the token',req.body)
       console.log('PUBTOKEN',req.body.access_token)
    try {
        const grab_accounts = await fetch(`https://${process.env.PLAID_ENV_URL}/accounts/get`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": `${process.env.PLAID_CLIENT_ID}`,
                "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
                "access_token": `${access_token}`
              })
          }
        )

        let account_id_response = await grab_accounts.json()
        console.log('result',account_id_response)
        res.status(200).json({account_id_response});
    }
        
    catch(error){
        res.status(500).json({error: error})
    }

}