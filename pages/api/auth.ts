// pages/api/user/[id].js
import publicTokenExchange from './public-token-exchange'
import accessTokenExchange from './access-token-exchange'
import getAccountInfo from './get-account-info'
import { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req:NextApiRequest, res:NextApiResponse):Promise<void> {   
    
    let method = 'GET'
  
    if (method === 'GET') {

        // const tokenResponse = await publicTokenExchange()
        
        // const accessToken = await accessTokenExchange(tokenResponse)

        // const accountInfo = await getAccountInfo(accessToken)

        //return res.status(200).json({message:'working as expected',data: accountInfo})
    
      // Handle POST request
    } else if (method === 'POST') {
        const { name } = req.body; // Assuming you send a JSON body like { name: 'Mango' }
        if (name) {
            res.status(201).json({ message: `Created new fruit: ${name}` });
        } else {
            res.status(400).json({ error: 'Name is required' });
        }

    // Handle PUT request
    } else if (method === 'PUT') {
        res.status(200).json({ message: 'Updating a resource' });

    // Handle DELETE request
    } else if (method === 'DELETE') {
        res.status(200).json({ message: 'Deleting a resource' });

    // If the method is unsupported, return 405
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
  