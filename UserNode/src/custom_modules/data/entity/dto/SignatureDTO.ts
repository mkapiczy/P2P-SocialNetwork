import {SignatureMetadataDTO} from "./SignatureMetadataDTO";

export class SignatureDTO {
    signature: String;
    metadata: SignatureMetadataDTO;

    constructor(signature: String, signer: String, hashAlgorithm) {
        this.signature = signature;
        this.metadata = new SignatureMetadataDTO(signer, hashAlgorithm);
    }
}