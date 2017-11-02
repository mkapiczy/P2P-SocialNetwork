const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const ursa = require('ursa');

export class KeyFileStore {
    private static keysFolderName = "keys";
    private static fileExtension = ".pem";

    public static writePublicKeyPemToStore(filename, key) {
        mkdirp(this.keysFolderName);

        const keyPath = path.join(this.keysFolderName, filename + "_public" + this.fileExtension);
        fs.writeFileSync(keyPath, key);
    }

    public static writePrivateKeyPemToStore(filename , key) {
        mkdirp(this.keysFolderName);

        const keyPath = path.join(this.keysFolderName, filename + "_private" + this.fileExtension);
        fs.writeFileSync(keyPath, key);
    }


    public static readPrivateKeyFromStore(filename) {
        let privateKey;
        const privateKeyNamePath = path.join(this.keysFolderName, filename + "_private" + this.fileExtension);
        if(fs.existsSync(privateKeyNamePath)) {
            privateKey = ursa.createPrivateKey(fs.readFileSync(privateKeyNamePath));
        }
        return privateKey;
    }

    public static readPublicKeyFromStore(filename) {
        let publicKey;
        const publicKeyNamePath = path.join(this.keysFolderName, filename + "_public" + this.fileExtension);
        if(fs.existsSync(publicKeyNamePath)) {
            publicKey = ursa.createPublicKey(fs.readFileSync(publicKeyNamePath));
        }
        return publicKey;
    }
}