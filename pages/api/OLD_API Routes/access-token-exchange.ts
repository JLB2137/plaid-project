import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
      
      const public_token = req.body.pubToken.public_token
       console.log('actually the token',req.body)
       console.log('PUBTOKEN',req.body.pubToken.public_token)
    try {
        const access_token = await fetch(`https://${process.env.PLAID_ENV_URL}/item/public_token/exchange`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": `${process.env.PLAID_CLIENT_ID}`,
                "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
                "public_token": `${public_token}`
              })
          }
        )

        let access_token_response = await access_token.json()
        console.log('result',access_token_response)
        res.status(200).json({access_token_response});
    }
        
    catch(error){
        res.status(500).json({error: error})
    }

}