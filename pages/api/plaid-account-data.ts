import {NextApiRequest,NextApiResponse} from "next";
import {PlaidClient} from "../../lib/plaidClient"
import clientPromise from '../../lib/mongodb'
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

    let client_user_id:string = req.body.jlbInvestmentsId.uid

    //create db class access
    const dbAccess = new MongoDBClass(db,client_user_id,encryption_key,iv_hex)

    //update userID to encrypted version
    client_user_id = await dbAccess.getEncryptedUserID(client_collection) as string
    const plaidAccess = new PlaidClient(secret,client_id,env_url,client_user_id,encryption_key,iv_hex)

    //encrypted userID = userCheck.encryptedUserID

    try{
        const access_tokens = await dbAccess.getUserTokens(client_collection,client_user_id) //returns an array of decrypted tokens
        const accounts = await plaidAccess.getBalance(access_tokens) //returns balance info for each token
        res.status(200).json({
            message: 'Link Token called successfully',
            accounts: accounts
        })
    }catch(error){
        console.log('error',error)
        res.status(500).json({
            message: 'Error creating Link Token',
            err: error
        })
    }



}