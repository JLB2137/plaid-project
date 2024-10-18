import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
       let public_token = req.body.public_token.public_token
       console.log('PUBTOKEN',public_token)
    try {
        const access_token = await fetch(`https://${process.env.env_url}/item/public_token/exchange`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "client_id": `${process.env.client_id}`,
                "secret": `${process.env.environment_secret}`,
                "public_token": `${public_token}`
              })
          }
        )

        let result = await access_token.json()
        console.log('result',result)
        res.status(200).json(result);
    }
        
    catch(error){
        console.log(error)
    }

}