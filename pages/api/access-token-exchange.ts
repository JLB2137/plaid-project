import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
      let public_token = await req.body.public_token
       console.log('actually the token',req)
       console.log('PUBTOKEN',req.body)
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

        let result = await access_token.json()
        console.log('result',result)
        res.status(200).json({result:result});
    }
        
    catch(error){
        res.status(500).json({error: error})
    }

}