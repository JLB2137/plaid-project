import { NextApiRequest, NextApiResponse } from "next"

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
        //need to adjust this so it includes accounts

    const access_token:string | null = req.body.access_token
        try {
            const transactions = await fetch(`https://${process.env.PLAID_ENV_URL}/transactions/get`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "secret":`${process.env.PLAID_SANDBOX_SECRET}`,
                    "client_id": `${process.env.PLAID_CLIENT_ID}`,
                    "access_token":`${access_token}`,
                    "start_date": '2024-07-01',
                    "end_date":'2024-11-01',
                  })
              }
            )
    
            let result = await transactions.json()
            console.log('result',result)
            res.status(200).json({result:result});
        }
            
        catch(error){
            res.status(500).json({error: error})
        }


}