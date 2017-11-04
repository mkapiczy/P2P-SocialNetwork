import {PublicKey} from "../data/entity/PublicKey";

export class DataEncrypter {

    public static encryptWithPublicKey(message, publicKey: PublicKey): String {
        return publicKey.getKeyObject().encrypt(message, 'base64');
    }

    public static decryptWithPrivateKey(message, privateKey: PublicKey): String {
        try {
            return privateKey.getKeyObject().decrypt(message, 'utf8');
        } catch (error) {
            console.log("INVALID DECRYPTION, WRONG PRIVATE KEY");
        }
    }

}
