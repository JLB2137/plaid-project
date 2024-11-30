import { Db } from 'mongodb';
import { encrypt, decrypt } from '../../encryption';
import { InvestmentAccounts, UserCheck } from '../../../types/types';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

export class PlaidClient{

    secret!: string;
    client_id!: string;
    env_url!: string;
    userCheck!: UserCheck
    encryption_key!: string
    ivHex!: string
    client_user_id!: string
    client_collection!:string
    account_collection!:string
    investment_collection!:string
    balance_collection!:string

    

    constructor(secret:string, client_id:string, env_url:string, encryptedUserID: string, encryption_key:string, iv_hex:string, client_collection:string, account_collection:string, investment_collection:string, balance_collection:string){
        this.secret = secret
        this.client_id = client_id
        this.env_url= env_url
        this.encryption_key = encryption_key
        this.ivHex = iv_hex
        this.client_user_id = encryptedUserID
        this.client_collection=client_collection
        this.account_collection=account_collection
        this.investment_collection=investment_collection
        this.balance_collection=balance_collection

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

    //adjust the access token save to also save the metadata for each account
    //account_collection?:string,
    async getAccessToken(public_token:string, db:Db, metadata:PlaidLinkOnSuccessMetadata, newUser: boolean) {
        
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

        //encryption for account IDs and names
        let institutionAccounts = []
        for(let i=0;i<metadata.accounts.length;i++){
            institutionAccounts.push({
                id: encrypt(metadata.accounts[i].id,this.encryption_key,this.ivHex),
                name: encrypt(metadata.accounts[i].name,this.encryption_key,this.ivHex),
                mask: metadata.accounts[i].mask,
                type: metadata.accounts[i].type,
                subtype: metadata.accounts[i].subtype,
                verification_status: metadata.accounts[i].name
            })
        }


        const accounts = {
            access_token: accessToken,  
            institution: {
                name: metadata.institution?.name,
                institution_id: metadata.institution?.institution_id
            },
            accounts: institutionAccounts
        }
        //encryptions
        

        if(newUser){
            //creates the document for the new user
            const userConfig = {
                user_id: this.client_user_id,
                access_tokens: [accessToken]
                

            }
            const accountConfig ={
                user_id: this.client_user_id,
                accounts: [accounts]
            }
            const investmenstConfig = {
                user_id: this.client_user_id,
                investments: ""
            }
            const balanceConfig = {
                user_id: this.client_user_id,
                balances: ""
            }
            //on new user, create a document for all collections
            await db.collection(this.client_collection).insertOne(userConfig)
            await db.collection(this.account_collection).insertOne(accountConfig)
            await db.collection(this.investment_collection).insertOne(investmenstConfig)
            await db.collection(this.balance_collection).insertOne(balanceConfig)
        }else{
            //when users aren't new, need to update client tokens list and accout information list
            const userSearchFilter = {user_id: this.client_user_id}
            const foundUser = await db.collection(this.client_collection).findOne(userSearchFilter)

            let accessTokenList = foundUser!.access_tokens
                accessTokenList.push(accessToken)
                const updatedAccessTokenList = {
                    //need to create the access token above from the exchange w public
                    $set: { access_tokens: accessTokenList }
                }
                await db.collection(this.client_collection).updateOne(userSearchFilter,updatedAccessTokenList)
            
            const userAccountsDocument = await db.collection(this.account_collection).findOne(userSearchFilter)
            console.log('documents',userAccountsDocument)
            let userAccounts = userAccountsDocument!.accounts
            console.log('accounts',userAccounts)
            console.log('accounted',accounts)
            userAccounts.push(accounts)
            const updatedAccountList = {
                $set: { accounts: userAccounts }
            }
            await db.collection(this.account_collection).updateOne(userSearchFilter,updatedAccountList)
             
        }
        

    }

    async deleteAccount(encrypted_access_token: string) {
        
        const access_token = decrypt(encrypted_access_token, this.encryption_key, this.ivHex)
        const body = {
            "client_id": `${this.client_id}`,
            "secret": `${this.secret}`,
            "access_token": `${access_token}`
        }

        //remove it from the user DB setup
        
        const request = await fetch(`${this.env_url}/item/remove`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
        )

        const deletion = await request.json()

        return deletion
        
    }


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


    async getInvestmentHoldings (accounts: InvestmentAccounts[]) {
        //need to parse output from DB for account token and subsequent account IDs
        let holdings = []


        for(let i=0;i<accounts.length;i++){
            
            const body = {
                "client_id": this.client_id,
                "secret": this.secret,
                "access_token": accounts[i].access_token,
                "options": {
                    "account_ids": accounts[i].account_ids
                }
            }
    
            const getHoldings = await fetch(`${this.env_url}/investments/holdings/get`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                }
            )

            
            let holdingData = await getHoldings.json()

            holdings.push({...holdingData,institution:accounts[i].institution})
            
        }

        //console.log('holdings',holdings)


        return holdings
    }


}