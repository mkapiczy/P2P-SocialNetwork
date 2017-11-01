const ursa = require('ursa');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class KeyManager {
    private keysFolderName = "keys";
    private privateKeyFileName = "privkey.pem";
    private publicKeyFileName = "pubkey.pem";
    private privateKeyPath = path.join(this.keysFolderName, this.privateKeyFileName);
    private publicKeyPath = path.join(this.keysFolderName, this.publicKeyFileName);

    private privateKey;
    private publicKey;

    constructor() {
        this.initKeysIfExist();
    }

    public generatePublicPrivateKeyPairAndWriteToFile(): void {
        const key = ursa.generatePrivateKey(2048, 65537);
        const privateKeyPem = key.toPrivatePem();
        const publicKeyPem = key.toPublicPem();

        mkdirp(this.keysFolderName);

        fs.writeFileSync(this.privateKeyPath, privateKeyPem);
        fs.writeFileSync(this.publicKeyPath, publicKeyPem);

        this.initKeysIfExist();
    }

    public encryptWithPublicKey(message: string, publicKey) {
        return publicKey.encrypt(message, 'utf8', 'base64');
    }

    public decryptWithPrivateKey(message: string) {
        return this.privateKey.decrypt(message, 'base64', 'utf8');
    }

    private initKeysIfExist() {
        this.privateKey = this.getPrivateKeyFromFile();
        this.publicKey = this.getPublicKeyFromFile();
    }

    private getPublicKeyFromFile() {
        let publicKey;
        if(fs.existsSync(this.publicKeyPath)) {
            publicKey = ursa.createPublicKey(fs.readFileSync(this.publicKeyPath))
        }
        return publicKey;
    }

    private getPrivateKeyFromFile(){
        let privateKey;
        if(fs.existsSync(this.publicKeyPath)) {
            privateKey = ursa.createPrivateKey(fs.readFileSync(this.privateKeyPath));
        }
        return privateKey;
    }

}

module.exports = KeyManager;