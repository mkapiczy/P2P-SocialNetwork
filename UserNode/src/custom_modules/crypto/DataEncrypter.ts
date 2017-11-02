
export class DataEncrypter {

    public static encryptWithPublicKey(message, publicKey) {
        return publicKey.encrypt(message, 'utf8', 'base64');
    }

    public static decryptWithPrivateKey(message, privateKey) {
        try {
            return privateKey.decrypt(message, 'base64', 'utf8');
        } catch (error) {
            console.log("INVALID DECRYPTION, WRONG PRIVATE KEY");
            return false;
        }
    }

}
