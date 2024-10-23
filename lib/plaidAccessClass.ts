import clientPromise from '../lib/mongodb'
export class PlaidAccess{

    contructor(){}

    async createLinkToken (secret:string,client_id:string,client_user_id:string,products:string,env_url:string) {
        const body = {
            "client_id": client_id,
            "secret": secret,
            "client_name": "JLB Investment Dashboard",
            "country_codes": ["US"],
            "language": "en",
            "user": {
                "client_user_id": client_user_id, 
            },
            "products": products
        }

        const linkTokenCall = await fetch(`https://${env_url}/link/token/create`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        )

        const linkTokenObj = linkTokenCall.json()

        return linkTokenObj
    }

    //need to save these for each profile
    async getAccessToken(public_token:string,client_db:string,client_id:string,client_user_id:string,secret:string,client_collection:string, env_url:string) {
        
        const body = {
            "client_id": `${client_id}`,
            "secret": `${secret}`,
            "public_token": `${public_token}`
        }
        
        const accessTokenCall = await fetch(`https://${env_url}/item/public_token/exchange`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        )

        const accessTokenResponse = await accessTokenCall.json()
        const accessToken = accessTokenResponse.access_token
        

        //need to exchange the public token for the access token
        
        //may need to adjust this so that it requires an input to determine products for this access token??
        //setup for the db to update the users access token list when receiving the token
        const client = await clientPromise
        const db = client.db(client_db)
        //need to call the encrypt to get the encrypted user id
        const userSearchFilter = {user_id: client_user_id}
        const user = await db.collection(client_collection!).findOne(userSearchFilter)

        if(user){
            const accessTokenList = user.access_tokens
            accessTokenList.push(accessToken)
            const updatedAccessTokenList = {
                //need to create the access token above from the exchange w public
                $set: { access_tokens: accessTokenList }
            }
            const result = await db.collection(client_collection).updateOne(userSearchFilter,updatedAccessTokenList)

        }else{
            //creates the document for the new user
            const userConfig = {
                user_id: client_user_id,
                access_tokens: [accessToken]
                

            }
            const result = await db.collection(client_collection).insertOne(userConfig)
        }
        

    }

}