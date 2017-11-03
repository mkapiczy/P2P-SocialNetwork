import {SignatureMetadata} from "./SignatureMetadata";

export class Signature {
    signature: String;
    metadata: SignatureMetadata;

    constructor(signature: String, signer: String, hashAlgorithm) {
        this.signature = signature;
        this.metadata = new SignatureMetadata(signer, hashAlgorithm);
    }
}