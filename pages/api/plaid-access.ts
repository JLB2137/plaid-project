import {NextApiRequest,NextApiResponse} from "next";
import {PlaidAccess} from "../../lib/plaidAccessClass"

const client_id = process.env.PLAID_CLIENT_ID!
const secret = process.env.PLAID_SANDBOX_SECRET!
const env_url = process.env.PLAID_ENV_URL!
//NEED to replace this user ID with one that is encrypted from google prof
const client_user_id = process.env.SITE_USER_ID!
const client_collection = process.env.CLIENT_COLLECTION!
const client_db = process.env.CLIENT_DB!


// pages/api/user/[id].js
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise < void > {

    const methodChoice = req.body.methodChoice
    const plaidAccess = new PlaidAccess

    if (methodChoice == 'createLinkToken') {
        const products = req.body.products
        try{
            const linkToken = await plaidAccess.createLinkToken(secret, client_id, client_user_id, products, env_url)
            res.status(200).json({
                message: 'Link Token called successfully',
                linkToken: linkToken
            })
        }catch(err){
            res.status(500).json({
                message: 'Error creating Link Token',
                err: err
            })
        }

    } else if (methodChoice == 'getAccessToken') {
        const public_token = req.body.public_token
        try {
            const createdAccessToken = await plaidAccess.getAccessToken(public_token, client_db, client_id, client_user_id, secret, client_collection, env_url)
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