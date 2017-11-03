import {Key} from "../entity/Key";
import {Signature} from "../entity/Signature";

export class AcknowledgmentRerquestMsg {
    key: Key;
    signature: Signature;

    constructor(key: Key, signature: Signature) {
        this.key = key;
        this.signature= signature;
    }
}