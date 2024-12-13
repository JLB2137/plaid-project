import {Db} from 'mongodb'
import {encrypt,decrypt} from '../../encryption'
import { GetBalancesResponse, InvestmentHoldingsApiResponse } from '../../../types/types'
export class MongoClient {

    db!: Db
    client_user_id!: string
    encryption_key!: string
    ivHex!: string

    constructor(db: Db, client_user_id: string, encryption_key: string, ivHex: string) {
        this.db = db
        this.client_user_id = client_user_id
        this.encryption_key = encryption_key
        this.ivHex = ivHex

    }


    async userCheck(collectionToSearch: string) {
        const users = await this.db.collection(collectionToSearch!).find().toArray()
        let encryptedUserID: string | null = null
        for (let i = 0; i < users.length; i++) {
            //console.log('decrypt',decrypt(users[i].user_id,this.encryption_key,this.ivHex))
            if (decrypt(users[i].user_id, this.encryption_key, this.ivHex) == this.client_user_id) {
                encryptedUserID = users[i].user_id as string
                break
            }
        }

        if (!encryptedUserID) {
            encryptedUserID = encrypt(this.client_user_id, this.encryption_key, this.ivHex)

            return {
                encryptedUserID,
                newUser: true
            }
        }

        return {
            encryptedUserID,
            newUser: false
        }



    }

    async getEncryptedUserID(client_collection: string){

        const users = await this.db.collection(client_collection!).find().toArray()
        let encryptedUserID: string | null = null
        for (let i = 0; i < users.length; i++) {
            //console.log('decrypt',decrypt(users[i].user_id,this.encryption_key,this.ivHex))
            if (decrypt(users[i].user_id, this.encryption_key, this.ivHex) == this.client_user_id) {
                encryptedUserID = users[i].user_id as string
                return encryptedUserID
            }
        }

    }

    async getEncryptedAccountIDToken(account_collection: string, encryptedUserID: string, account_id: string){
        //returns the encrypted accountID and it's encrypted access token
        console.log('account_id',account_id)
        const userSearchFilter = {user_id: encryptedUserID}
        let userAccount = await this.db.collection(account_collection!).findOne(userSearchFilter)
        let encryptedAccountID: string | null = null
        let encryptedAccessToken: string | null = null
        for (let i = 0; i < userAccount!.accounts.length; i++) {
            //console.log('here',userAccount!.accounts[i])
            for(let j = 0;j<userAccount!.accounts[i].accounts.length;j++){
                if (decrypt(userAccount!.accounts[i].accounts[j].id, this.encryption_key, this.ivHex) == account_id) {
                    encryptedAccountID = userAccount!.accounts[i].accounts[j].id
                    encryptedAccessToken = userAccount!.accounts[i].access_token
                    return {
                        encrypted_account_id: encryptedAccountID,
                        encrypted_access_token: encryptedAccessToken
                    }
                }
            }

        }

        return {
            error: 'no account was found'
        }

    }

    async getUserTokens(client_collection: string, encryptedUserID: string){
        const userSearchFilter = {user_id: encryptedUserID}
        const user = await this.db.collection(client_collection!).findOne(userSearchFilter)

        let decryptedTokens = []

        for(let i=0;i<user!.access_tokens.length;i++){
            decryptedTokens.push(decrypt(user!.access_tokens[i], this.encryption_key, this.ivHex))
        }

        return decryptedTokens
        
    }

    async getInvestmentAccounts(account_collection: string, encryptedUserID: string){
        const userSearchFilter = {user_id: encryptedUserID}
        const userAccounts = await this.db.collection(account_collection!).findOne(userSearchFilter)
        let investmentAccounts = [] 
        //console.log('acc',userAccounts)
        if(userAccounts){
            for(let i=0;i<userAccounts!.accounts.length;i++){
                //console.log('here',userAccounts!.accounts[i])
                let institutionAccounts = []
                for(let j=0;j<userAccounts!.accounts[i].accounts.length;j++){
                    if(userAccounts!.accounts[i].accounts[j].type == "investment"){
                        //console.log('returned accounts',userAccounts!.accounts[i].accounts[j])
                        institutionAccounts.push(decrypt(userAccounts!.accounts[i].accounts[j].id, this.encryption_key, this.ivHex))
                    }           
                }
                investmentAccounts.push({
                    access_token: decrypt(userAccounts!.accounts[i].access_token,this.encryption_key, this.ivHex),
                    institution: userAccounts!.accounts[i].institution.name,
                    account_ids: institutionAccounts
                })     
    
            }
        }


        return investmentAccounts
        
    }

    async deleteAccount(client_collection:string, account_collection: string, encrypted_access_token:string, encrypted_user_id: string){
        const userSearchFilter = {user_id: encrypted_user_id}
        let userAccount = await this.db.collection(account_collection!).findOne(userSearchFilter)
        //console.log('acc',userAccount)
        let accounts = userAccount!.accounts
   
        
        for(let i=0;i<accounts.length;i++){
            if (accounts[i].access_token == encrypted_access_token){
                accounts.splice(i,1)
                const updatedAccountList = {
                    //need to create the access token above from the exchange w public
                    $set: { accounts: accounts }
                }
                await this.db.collection(account_collection).updateOne(userSearchFilter,updatedAccountList)
        
            }
             

        }

        userAccount = await this.db.collection(client_collection!).findOne(userSearchFilter)
        let accessTokenList = userAccount!.access_tokens

        for(let i =0;i<accessTokenList.length;i++){
            if(accessTokenList[i] == encrypted_access_token){
                accessTokenList.splice(i,1)
            }
        }
        const updatedAccessTokenList = {
            //need to create the access token above from the exchange w public
            $set: { access_tokens: accessTokenList }
        }
        await this.db.collection(client_collection).updateOne(userSearchFilter,updatedAccessTokenList)
 

        return 'Accounts Deleted'
        
    }

    async cacheInvestments (investments_collection:string,clientInvestments: InvestmentHoldingsApiResponse[], encrypted_user_id: string) {
        //need to parse output from DB for account token and subsequent account IDs

        const stringified = JSON.stringify(clientInvestments)

        const encryptedInvestments = encrypt(stringified,this.encryption_key, this.ivHex)

        //need to check if the user exists... 
        const userSearchFilter = {user_id: encrypted_user_id}
        //overwrites existing information here
        const updatedAccessTokenList = {
            //need to create the access token above from the exchange w public
            $set: { investments: encryptedInvestments }
        }
        await this.db.collection(investments_collection).updateOne(userSearchFilter,updatedAccessTokenList)


    }

    async getInvestmentsCache(investments_collection:string, encrypted_user_id: string) {
        //need to parse output from DB for account token and subsequent account IDs
        const userInvestments = await this.db.collection(investments_collection).findOne({ user_id: encrypted_user_id })
        let investments

        if(userInvestments){
            investments = decrypt(userInvestments!.investments,this.encryption_key, this.ivHex)

            investments = JSON.parse(investments)
    
            //console.log('investments',investments)
        }else{
            investments = null 
        }


        

        
        

        return investments

    }

    async cacheBalances (balance_collection:string,clientBalances: GetBalancesResponse[], encrypted_user_id: string) {
        //need to parse output from DB for account token and subsequent account IDs

        const stringified = JSON.stringify(clientBalances)

        const encryptedBalances = encrypt(stringified,this.encryption_key, this.ivHex)

        //need to check if the user exists... 
        const userSearchFilter = {user_id: encrypted_user_id}
        //overwrites existing information here
        const updatedAccessTokenList = {
            //need to create the access token above from the exchange w public
            $set: { balances: encryptedBalances }
        }
        await this.db.collection(balance_collection).updateOne(userSearchFilter,updatedAccessTokenList)


    }

    async getBalanceCache(balance_collection:string, encrypted_user_id: string) {
        //need to parse output from DB for account token and subsequent account IDs
        const userBalances = await this.db.collection(balance_collection).findOne({ user_id: encrypted_user_id })
        
        let balances

        //console.log('user balances',userBalances)

        if(userBalances){
            balances = decrypt(userBalances!.balances,this.encryption_key, this.ivHex)

            balances = JSON.parse(balances)
    
            //console.log('balances cache',balances)
        }else{
            balances = null 
        }


        

        
        

        return balances

    }

    

}