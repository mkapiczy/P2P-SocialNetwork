import {SignatureDTO} from "./SignatureDTO";
import {KeyDTO} from "./KeyDTO";

export class SignedKeyDTO {
    key: KeyDTO;
    signature: SignatureDTO;

    constructor(key: KeyDTO, signature: SignatureDTO) {
        this.key = key;
        this.signature = signature;
    }
}