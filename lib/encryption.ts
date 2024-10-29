import crypto from 'crypto';

// Common algorithm used for both encryption and decryption
const algo = 'aes-256-cbc';

// Function to encrypt data
export function encrypt(plainText: string, key: string, ivHex: string): string {
    const bufferKey = Buffer.from(key, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const cipher = crypto.createCipheriv(algo, bufferKey, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

// Function to decrypt data
export function decrypt(encryptedToken: string, key: string, ivHex: string): string {
    const bufferKey = Buffer.from(key, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algo, bufferKey, iv);

    let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf8');
    decryptedToken += decipher.final('utf8');

    return decryptedToken;
}
