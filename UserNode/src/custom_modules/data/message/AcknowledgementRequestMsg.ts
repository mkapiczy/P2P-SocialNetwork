import {KeyDTO} from "../entity/dto/KeyDTO";
import {SignatureDTO} from "../entity/dto/SignatureDTO";

export class AcknowledgmentRerquestMsg {
    key: KeyDTO;
    signature: SignatureDTO;

    constructor(key: KeyDTO, signature: SignatureDTO) {
        this.key = key;
        this.signature= signature;
    }
}