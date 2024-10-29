import {
    Db
} from 'mongodb'
import {
    encrypt,
    decrypt
} from './encryption'
import {
    User
} from 'firebase/auth'
export class MongoDBClass {

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

    async userCheck(client_collection: string) {
        const users = await this.db.collection(client_collection!).find().toArray()
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

}