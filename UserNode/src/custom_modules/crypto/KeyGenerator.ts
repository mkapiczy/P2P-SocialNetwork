import {KeyFileStore} from "./KeyFileStore";

const ursa = require('ursa');

export class KeyGenerator {

    public static generatePublicPrivateKeyPairAndWriteToFile(nodeId: String): void {
        const key = ursa.generatePrivateKey(2048, 65537);
        const privateKeyPem = key.toPrivatePem();
        const publicKeyPem = key.toPublicPem();

        KeyFileStore.writePrivateKeyPemToStore(nodeId, privateKeyPem);
        KeyFileStore.writePublicKeyPemToStore(nodeId, publicKeyPem);
    }

}
