import {NextApiRequest,NextApiResponse} from "next";
import {PlaidClient} from "../../lib/api/plaid/plaidClient"
import clientPromise from '../../lib/api/mongo/mongodb'
import { MongoClient } from "../../lib/api/mongo/mongoClient";
import { InvestmentHoldingsApiResponse } from "../../types/types";



//NEED to replace this user ID with one that is encrypted from google prof
const client_collection = process.env.CLIENT_COLLECTION!
const investment_collection = process.env.INVESTMENT_COLLECTION!
const balance_collection = process.env.BALANCE_COLLECTION!
const client_db = process.env.CLIENT_DB!
const encryption_key = process.env.ENCRYPTION_KEY!
const iv_hex = process.env.IV_HEX!


// pages/api/user/[id].js
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise < void > {

    //create the db connection
    const client = await clientPromise
    const db = client.db(client_db)
    //console.log('db',db)

    const client_user_id:string = req.body.jlbInvestmentsId.uid
    const method: string = req.body.method
    //convert to turnary below
    let account_id: string = ""
    if(req.body.accountID){
        account_id = req.body.accountID
    }
    

    //create db class access
    const dbAccess = new MongoClient(db,client_user_id,encryption_key,iv_hex)


    //update userID to encrypted version
    const encrypted_user_id = await dbAccess.getEncryptedUserID(client_collection) as string

    //encrypted userID = userCheck.encryptedUserID
    if(method == 'getInvestments'){
        try{
            const investments = await dbAccess.getInvestmentsCache(investment_collection,encrypted_user_id)
            res.status(200).json({
                message: 'Investments retreived successfully',
                holdings: investments
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({
                message: 'Error retreiving investment cache from DB',
                err: error
            })
        }
    }else if(method == 'getBalances'){
        try{
            const balances = await dbAccess.getBalanceCache(balance_collection,encrypted_user_id)
            res.status(200).json({
                message: 'Balances retreived successfully',
                accounts: balances
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({
                message: 'Error retreiving balance cache from DB',
                err: error
            })
        }
    }

}