import * as NodeRSA from 'node-rsa'
import {IKey} from "./IKey";

export class PrivateKey implements IKey {
    private key : NodeRSA;

    constructor(key: NodeRSA.Key) {
        this.key = new NodeRSA();
        this.key.importKey(key,'pkcs1-private-pem');
    }

    toString(): String {
        return this.key.exportKey('pkcs1-private-pem').toString();
    }

    getKeyObject(): NodeRSA {
        return this.key;
    }
}