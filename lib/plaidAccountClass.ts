import { UserCheck } from '../pages/types/types';

export class PlaidAccountInformation{

    secret!: string;
    client_id!: string;
    env_url!: string;
    userCheck!: UserCheck
    encryption_key!: string
    ivHex!: string
    newUser!: boolean
    client_user_id!: string
    

    constructor(secret:string, client_id:string, env_url:string, userCheck: UserCheck, encryption_key:string, iv_hex:string){
        this.secret = secret
        this.client_id = client_id
        this.env_url= env_url
        this.encryption_key = encryption_key
        this.ivHex = iv_hex
        this.newUser = userCheck.newUser
        this.client_user_id = userCheck.encryptedUserID

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
            "products": products
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

}