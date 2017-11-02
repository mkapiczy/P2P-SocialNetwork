
export class DataSigner {

    public static signDataWithPrivateKey(data, privateKey) {
        return privateKey.hashAndSign('sha256', data, 'utf8', 'base64');
    }

    public static isSignatureValid(data, signature, publicKey) {
        let dataBase64 = new Buffer(data).toString('base64');

        try {
            return publicKey.hashAndVerify('sha256', dataBase64, signature, 'base64');
        } catch (error) {
            console.log("INVALID SIGNATURE");
            return false;
        }
    }

}
