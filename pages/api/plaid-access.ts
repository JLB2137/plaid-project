
import clientPromise from '../../lib/mongodb'
export class PlaidAccess{

    client_id?: string
    secret?: string
    env_url?:string
    client_user_id?:string
    headers?: HeadersInit
    method?: string
    products?: string[]
    client_collection?: string




    contructor(products:string[]){
        this.client_id = process.env.PLAID_CLIENT_ID
        this.secret = process.env.PLAID_SANDBOX_SECRET
        this.env_url = process.env.PLAID_ENV_URL
        //NEED to replace this user ID with one that is encrypted from google prof
        this.client_user_id = process.env.SITE_USER_ID
        this.method = 'POST'
        this.headers = {'Content-Type': 'application/json'}
        //adjust this based on what I need
        this.products? products : ["assets","transactions"]
        this.client_collection = process.env.CLIENT_COLLECTION

    }

    createLinkToken () {
        const body = {
            "client_id": this.client_id,
            "secret": this.secret,
            "client_name": "JLB Investment Dashboard",
            "country_codes": ["US"],
            "language": "en",
            "user": {
                "client_user_id": this.client_user_id, 
            },
            "products": this.products
        }

        const linkTokenCall = await fetch(`https://${process.env.PLAID_ENV_URL}/link/token/create`,
            {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(body)
            }
        )

        return linkTokenCall.json()
    }

    //need to save these for each profile
    //first check if user already exists
    //either create or update on db
    getAccessToken() {
        //may need to adjust this so that it requires an input to determine products for this access token??
        //setup for the db to update the users access token list when receiving the token
        const client = await clientPromise
        const db = client.db(process.env.CLIENT_DB)
        //need to call the encrypt to get the encrypted user id
        const userSearchFilter = {user_id: this.client_user_id}
        const user = await db.collection(this.client_collection).findOne(userSearchFilter)
        
        if(user?.length>0){
            const accessTokenList = user?.access_tokens
            accessTokenList.push(accessToken)
            const updatedAccessTokenList = {
                //need to create the access token above from the exchange w public
                $set: { access_tokens: accessTokenList }
            }
            const result = await db.collection(this.client_collection).updateOne(userSearchFilter,updatedAccessTokenList)

        }else{
            const userConfig = {
                user_id: this.client_user_id,
                access_tokens: [accessToken]
                

            }
            const result = await db.collection(this.client_collection).insertOne(userConfig)
        }
        

    }

    url = https://${process.env.PLAID_ENV_URL}/sandbox/public_token/create
    body = JSON.stringify({
        "client_id": `${process.env.PLAID_CLIENT_ID}`,
        "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
        "institution_id": "ins_20",
        "initial_products": ["auth"],
        "options": {
            "webhook": "https://www.genericwebhookurl.com/webhook"
        }
    })



}

import { NextApiRequest, NextApiResponse } from "next";

// pages/api/user/[id].js
export default async function handler(req:NextApiRequest, res:NextApiResponse): Promise<void> {   
    
    const methodChoice = req.body.classMethod
    body: JSON.stringify({ pubToken }),
    
    try {
            const public_token =  await fetch(`https://${process.env.PLAID_ENV_URL}/sandbox/public_token/create`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "client_id": `${process.env.PLAID_CLIENT_ID}`,
                    "secret": `${process.env.PLAID_SANDBOX_SECRET}`,
                    "institution_id": "ins_20",
                    "initial_products": ["auth"],
                    "options": {
                        "webhook": "https://www.genericwebhookurl.com/webhook"
                    }
                })
                }
            )

            let result = await public_token.json()

            console.log('resultofPublic Token',result)

            res.status(200).json({ public_token: result });
        }
            
        catch(error){
            console.log(error)
        }

}