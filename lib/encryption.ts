import crypto from 'crypto';

// Common algorithm used for both encryption and decryption
const algo = 'aes-256-cbc';

// Function to encrypt data
export function encrypt(plainText: string, key: Buffer, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const cipher = crypto.createCipheriv(algo, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

// Function to decrypt data
export function decrypt(encryptedToken: string, key: Buffer, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algo, key, iv);

    let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    return decryptedToken;
}
