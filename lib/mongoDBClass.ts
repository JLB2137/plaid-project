import clientPromise from '../lib/mongodb'
import {UserData} from '../pages/types/types'
export class PlaidAccess{

    client_collection!:string
    userSearchFilter!: {string:string}
    client_user_id!: string

    constructor(db: string, client_user_id:string, access_token?: string,client_collection: string,){
        this.client_collection = client_collection
        this.db = db
        this.accessToken = access_token

    }

    async createLinkToken (products:string) {
        const client = await clientPromise
        const db = client.db(client_db)
        //need to call the encrypt to get the encrypted user id
        const userSearchFilter = {user_id: this.client_user_id}
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
                user_id: this.client_user_id,
                access_tokens: [accessToken]
                

            }
            const result = await db.collection(client_collection).insertOne(userConfig)
        }
        

    }

}