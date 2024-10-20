import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '../../lib/mongodb.js'

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    
    try{

        const client = await clientPromise
        const db = client.db('NAME OF DB')
        const data = await db.collection('COLLECTION NAME').find({}).toArray()


        res.status(200).json(data)


    }

    catch(error){

        res.status(500).json({message: 'error occurred connecting to db'})


    }

}






