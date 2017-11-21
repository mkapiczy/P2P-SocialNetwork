import * as NodeRSA from 'node-rsa'
import {IKey} from "./IKey";

export class PublicKey implements IKey {
    private key : NodeRSA;

    constructor(key: string) {
        this.key = new NodeRSA();
        this.key.importKey(key,'pkcs1-public-pem');
    }

    toString(): String {
        return this.key.exportKey('pkcs1-public-pem').toString();
    }

    getKeyObject(): NodeRSA {
        return this.key;
    }
}