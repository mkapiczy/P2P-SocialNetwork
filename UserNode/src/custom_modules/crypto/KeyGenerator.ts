import {KeyFileStore} from "./KeyFileStore";
var NodeRSA = require('node-rsa');

export class KeyGenerator {

    public static generatePublicPrivateKeyPairAndWriteToFile(nodeId: String): void {
        const key = new NodeRSA({b: 2048});
        console.log("KeyDTO: " + key.exportKey('pkcs1-private-pem'));

        KeyFileStore.writePrivateKeyPemToStore(nodeId, key.exportKey('pkcs1-private-pem'));
        KeyFileStore.writePublicKeyPemToStore(nodeId, key.exportKey('pkcs1-public-pem'));
    }

}
