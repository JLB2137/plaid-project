import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../lib/mongodb'
//is setup to be used for the client configuration

export default async function handler(req:NextApiRequest,res:NextApiResponse) {

    const input = req.body

    console.log('req BODY',input)
    
    try{

        const client = await clientPromise
        console.log('here','\n')
        console.log('client',client)
        const db = client.db(String(process.env.CLIENT_DB))
        const data = await db.collection(String(process.env.CLIENT_COLLECTION)).find({}).toArray()
        await db.collection(String(process.env.CLIENT_COLLECTION)).insertOne(input)


        res.status(200).json(input)


    }

    catch(error){

        res.status(500).json({message: error})


    }

}






