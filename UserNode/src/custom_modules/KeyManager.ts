import { NodeRSA } from 'node-rsa';

class KeyManager {
    key: NodeRSA;

    constructor() {
        this.key = new NodeRSA({b: 512});
    }

    public encrypt(orig: string, privKey: string): string{
        this.key.importKey(privKey, 'pkcs1-private-der');
        return this.key.encryptPrivate(orig, 'base64');
    }

    public decrypt(encrypted: string, pubKey: string): string{
        this.key.importKey(pubKey, 'pkcs8-public-der');
        return this.key.decryptPublic(encrypted, 'utf8');
    }

}