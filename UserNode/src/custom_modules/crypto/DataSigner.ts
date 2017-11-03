
export class DataSigner {

    public static signDataWithPrivateKey(data, privateKey) {
        return privateKey.sign(data);
    }

    public static isSignatureValid(data, signature, publicKey) {
        try {
            return publicKey.verify(data, signature);
        } catch (error) {
            console.log("INVALID SIGNATURE");
            return false;
        }
    }

}
