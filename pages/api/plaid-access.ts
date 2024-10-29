import {NextApiRequest,NextApiResponse} from "next";
import {PlaidAccess} from "../../lib/plaidAccessClass"
import {encrypt, decrypt} from "../../lib/encryption"
import clientPromise from '../../lib/mongodb'
import crypto from 'crypto'
import { MongoDBClass } from "../../lib/mongoDBClass";



const client_id = process.env.PLAID_CLIENT_ID!
const secret = process.env.PLAID_SANDBOX_SECRET!
const env_url = process.env.PLAID_ENV_URL!
//NEED to replace this user ID with one that is encrypted from google prof
const client_collection = process.env.CLIENT_COLLECTION!
const client_db = process.env.CLIENT_DB!
const encryption_key = process.env.ENCRYPTION_KEY!
const iv_hex = process.env.IV_HEX!


// pages/api/user/[id].js
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise < void > {

    //create the db connection
    const client = await clientPromise
    const db = client.db(client_db)

    const methodChoice = req.body.methodChoice
    let client_user_id:string = req.body.jlbInvestmentsId.uid
    const dbAccess = new MongoDBClass(db,client_user_id,encryption_key,iv_hex)

    //update userID to encrypted version
    const userCheck = await dbAccess.userCheck(client_collection)
    const plaidAccess = new PlaidAccess(secret,client_id,env_url,userCheck,encryption_key,iv_hex)

    if (methodChoice == 'createLinkToken') {
        const products = req.body.products
        try{
            const linkToken = await plaidAccess.createLinkToken(products)
            res.status(200).json({
                message: 'Link Token called successfully',
                linkToken: linkToken
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({
                message: 'Error creating Link Token',
                err: error
            })
        }

    } else if (methodChoice == 'getAccessToken') {
        const public_token = req.body.public_token
        try {

            const createdAccessToken = await plaidAccess.getAccessToken(public_token, db, client_collection)
            //const result = await accessTokenSaved   
            //console.log('returned info in plaid-access for access token',result)
            res.status(200).json({
                message: 'Access Token creation and caching to DB completed successfully',
                createdAccessToken: createdAccessToken
            })
        } catch (err) {
            res.status(500).json({
                message: 'Error when creating Access Token',
                err: err
            })
        }

    }


}