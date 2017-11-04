import {PrivateKey} from "../data/entity/PrivateKey";
import {PublicKey} from "../data/entity/PublicKey";

export class DataSigner {

    public static signDataWithPrivateKey(data, privateKey: PrivateKey): string {
        return privateKey.getKeyObject().sign(data, 'base64');
    }

    public static isSignatureValid(data, signature: string, publicKey: PublicKey): Boolean {
        try {
            return publicKey.getKeyObject().verify(data, signature, 'utf8','base64');
        } catch (error) {
            console.log("INVALID SIGNATURE");
            return false;
        }
    }

}
