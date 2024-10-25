import crypto from 'crypto'

export default function decrypt(encryptedToken:string,ivHex:string,key:string):string{
    const algo = 'aes-256-cbc'
    const iv = Buffer.from(ivHex,'hex')
    const decipher = crypto.createDecipheriv(algo,key,iv)

    let decryptedToken = decipher.update(encryptedToken,'hex','utf8')
    decryptedToken+=decipher.final('utf8')

    return decryptedToken
}

