import {NextApiRequest,NextApiResponse} from "next";
import {PlaidClient} from "../../lib/plaidClient"
import clientPromise from '../../lib/api/mongo/mongodb'
import { MongoClient } from "../../lib/api/mongo/mongoClient";
import { InvestmentHoldingsApiResponse } from "../../types/types";



const client_id = process.env.PLAID_CLIENT_ID!
const secret = process.env.PLAID_SANDBOX_SECRET!
const env_url = process.env.PLAID_ENV_URL!
//NEED to replace this user ID with one that is encrypted from google prof
const client_collection = process.env.CLIENT_COLLECTION!
const account_collection = process.env.ACCOUNT_COLLECTION!
const investment_collection = process.env.INVESTMENT_COLLECTION!
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
    const plaidAccess = new PlaidClient(secret,client_id,env_url,encrypted_user_id,encryption_key,iv_hex)

    //encrypted userID = userCheck.encryptedUserID
    if(method == 'getBalance'){
        try{
            const access_tokens = await dbAccess.getUserTokens(client_collection,encrypted_user_id) //returns an array of decrypted tokens
            const accounts = await plaidAccess.getBalance(access_tokens) //returns balance info for each token
            res.status(200).json({
                message: 'Balances called successfully',
                accounts: accounts
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({
                message: 'Error getting account balances',
                err: error
            })
        }
    }else if(method == 'getInvestmentHoldings'){
        try{

            const accounts = await dbAccess.getInvestmentAccounts(account_collection,encrypted_user_id) //returns an array of decrypted tokens
            //console.log('accounts in api',accounts)
            const holdings: InvestmentHoldingsApiResponse[] = await plaidAccess.getInvestmentHoldings(accounts) //investments for the token
            //cache the holdings to be used later
            await dbAccess.cacheInvestments(investment_collection,holdings,encrypted_user_id)
            res.status(200).json({
                message: 'Holdings called successfully',
                holdings: holdings
            })
        }catch(error){
            console.log('error',error)
            res.status(500).json({
                message: 'Error getting holdings',
                err: error
            })
        }
    }else if (method == 'deleteAccount') {

        try {
            const encryptedTokenAccount = await dbAccess.getEncryptedAccountIDToken(account_collection, encrypted_user_id, account_id)
            console.log('encryptedTokenAccount',encryptedTokenAccount)
            const dbDeletionResponse = await dbAccess.deleteAccount(client_collection, account_collection, encryptedTokenAccount!.encrypted_access_token!, encrypted_user_id)
            console.log('dbDeletionResponse',dbDeletionResponse)
            const plaidDeletionResponse = await plaidAccess.deleteAccount(encryptedTokenAccount!.encrypted_access_token!)
            console.log('plaidDeletionResponse',plaidDeletionResponse)
            //const result = await accessTokenSaved   
            //console.log('returned info in plaid-access for access token',result)
            res.status(200).json({
                message: 'Account Successfuly Deleted',
                dbResponse: dbDeletionResponse,
                plaidResponse: plaidDeletionResponse
            })
        } catch (err) {
            res.status(500).json({
                message: 'Error when deleting account',        
                err: err
            })
        }
    }




}