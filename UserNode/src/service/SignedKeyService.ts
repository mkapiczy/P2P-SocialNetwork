import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {SignatureDTO} from "../custom_modules/data/entity/dto/SignatureDTO";
import {SignedKeyDTO} from "../custom_modules/data/entity/dto/SignedKeyDTO";
import {KeyDTO} from "../custom_modules/data/entity/dto/KeyDTO";
import {DataSigner} from "../custom_modules/crypto/DataSigner";
import {PublicKey} from "../custom_modules/data/entity/PublicKey";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class SignedKeyService {

    constructor() {

    }

    public generateSignedKey(username: String, key: KeyDTO): SignedKeyDTO {
        // generate signature
        let stringSignature = DataSigner.signDataWithPrivateKey(key.value, global.privateKey);
        let signature = new SignatureDTO(stringSignature, username, "base64");
        signature.metadata.signer = global.node.username;
        console.log("Generating signed key as signer username:" + signature.metadata.signer);
        return new SignedKeyDTO(key, signature);
    }

    public publishSignedKeyIntoTheNetwork(username: String, signedKey: SignedKeyDTO, callback) {
        kademlia.storeValue(username, signedKey, ValueTypeEnum.SIGNED_KEY, global.SignedKeyManager, () => {
            callback();
        });
    }

    public getUsersSignedKey(username: String, callback: (result: SignedKeyDTO) => void) {
        let localKey = global.SignedKeyManager.findValueByNonHashedKey(username);

        console.log("Looking for key : " + username);
        if (localKey) {
            console.log("Key found in local store");
            callback(localKey);
        } else {
            console.log("Looking for a key in the network");
            kademlia.findValue(username, ValueTypeEnum.SIGNED_KEY, (signedKey, nodeId) => {
                if (signedKey) {
                    console.log("Found a signed key: " + signedKey + "  nodeId: " + nodeId);
                    callback(signedKey)
                } else {
                    console.log("Key not found");
                    callback(null);
                }
            });
        }
    }

    public isUserPublicKeyValid(username: string, callback) {
        let isValid;

        this.getUsersSignedKey(username,  (signedKeyDto) => {
            if (!signedKeyDto) {
                callback(false);
                return;
            }

            let signature = signedKeyDto.signature.signature;
            let key = signedKeyDto.key.value;
            let keySigner = signedKeyDto.signature.metadata.signer;
            console.log("KEY SIGNER: " + keySigner);
            if (keySigner !== global.node.username) {
                console.log("Ask network for public key signer with id: " + keySigner);
                this.getUsersSignedKey(keySigner,  (signersKeyDto) => {
                    console.log("Public key received from network, ID:" + signersKeyDto.key.value);
                    let signerKey = signersKeyDto.key.value;
                    let signersPublicKey = new PublicKey(signerKey.toString());
                    isValid = DataSigner.isSignatureValid(key, signature.toString(), signersPublicKey);
                    console.log("Is signature valid: " + isValid);
                    callback(isValid)
                });
            } else {
                isValid = DataSigner.isSignatureValid(key, signature.toString(), global.publicKey);
                console.log("Is signature valid: " + isValid);
                callback(isValid)
            }
        });
    }


}


export default new SignedKeyService();

