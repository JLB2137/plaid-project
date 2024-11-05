import { Db } from 'mongodb';
import { encrypt } from './encryption';
import { UserCheck } from '../pages/types/types';
export class PlaidClient{

    secret!: string;
    client_id!: string;
    env_url!: string;
    userCheck!: UserCheck
    encryption_key!: string
    ivHex!: string
    client_user_id!: string
    

    constructor(secret:string, client_id:string, env_url:string, encryptedUserID: string, encryption_key:string, iv_hex:string){
        this.secret = secret
        this.client_id = client_id
        this.env_url= env_url
        this.encryption_key = encryption_key
        this.ivHex = iv_hex
        this.client_user_id = encryptedUserID

    }

    async createLinkToken (products:[string]) {

        const body = {
            "client_id": this.client_id,
            "secret": this.secret,
            "client_name": "JLB Investment Dashboard",
            "country_codes": ["US"],
            "language": "en",
            "user": {
                "client_user_id": this.client_user_id, 
            },
            "products": ["assets"],
            "required_if_supported_products": products
        }

        const linkTokenCall = await fetch(`${this.env_url}/link/token/create`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        )

        const linkTokenObj = linkTokenCall.json()

        return linkTokenObj
    }

    async getAccessToken(public_token:string, db:Db, client_collection:string, newUser: boolean) {
        
        const body = {
            "client_id": `${this.client_id}`,
            "secret": `${this.secret}`,
            "public_token": `${public_token}`
        }
        
        const accessTokenCall = await fetch(`${this.env_url}/item/public_token/exchange`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        )

        const accessTokenResponse = await accessTokenCall.json()
        let accessToken = accessTokenResponse.access_token
        accessToken = encrypt(accessToken,this.encryption_key,this.ivHex)
        

        if(newUser){
            //creates the document for the new user
            const userConfig = {
                user_id: this.client_user_id,
                access_tokens: [accessToken]
                

            }
            await db.collection(client_collection).insertOne(userConfig)
        }else{
            const userSearchFilter = {user_id: this.client_user_id}
            const foundUser = await db.collection(client_collection).findOne(userSearchFilter)
            let accessTokenList = foundUser!.access_tokens
                accessTokenList.push(accessToken)
                const updatedAccessTokenList = {
                    //need to create the access token above from the exchange w public
                    $set: { access_tokens: accessTokenList }
                }
                await db.collection(client_collection).updateOne(userSearchFilter,updatedAccessTokenList)
        }
        

    }


    //access tokens need to be decrypted
    async getBalance (access_tokens:string[]) {

        let account
        let accounts = []

        for(let i=0;i<access_tokens.length;i++){
            
            const body = {
                "client_id": this.client_id,
                "secret": this.secret,
                "access_token": access_tokens[i]
            }
    
            const balance = await fetch(`${this.env_url}/accounts/balance/get`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

        

            account = await balance.json()
            accounts.push(account)
        }


        return accounts
    }


    async getInvestmentHoldings (access_tokens:string[]) {

        let holdings = []


        for(let i=0;i<access_tokens.length;i++){
            
            const body = {
                "client_id": this.client_id,
                "secret": this.secret,
                "access_token": access_tokens[i]
            }
    
            const getHoldings = await fetch(`${this.env_url}/investments/holdings/get`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

        
            let holdingData = await getHoldings.json()
            holdings.push(holdingData)
        }


        return holdings
    }


}