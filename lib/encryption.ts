import crypto from 'crypto'

export function encrypt(token:string):{iv:string,encryptedToken:string}{
    const algo = 'aes-256-cbc'
    const key = String(process.env.ENCRYPTION_KEY) 
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algo,key,iv)

    let encryptedToken = cipher.update(token,'utf8','hex')
    encryptedToken+=cipher.final('hex')

    return {
        iv: iv.toString('hex'),
        encryptedToken: encryptedToken
        
    }
}

