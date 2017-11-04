export class SignatureMetadataDTO {
    signer: String;
    hashAlgorithm: String;
    timestamp: Date;

    constructor(signer:String, hashAlgorithm:String){
        this.signer = signer;
        this.hashAlgorithm = hashAlgorithm;
        this.timestamp = new Date();
    }
}