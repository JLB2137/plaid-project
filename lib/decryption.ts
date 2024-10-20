import crypto from 'crypto'

export default function encrypt(encryptedToken:string,ivHex:string):string{
    const algo = 'aes-256-cbc'
    const key = String(process.env.ENCRYPTION_KEY)    
    const iv = Buffer.from(ivHex,'hex')
    const decipher = crypto.createDecipheriv(algo,key,iv)

    let decryptedToken = decipher.update(encryptedToken,'hex','utf8')
    decryptedToken+=decipher.final('utf8')

    return decryptedToken
}

