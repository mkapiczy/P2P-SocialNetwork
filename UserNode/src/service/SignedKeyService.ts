import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {SignatureDTO} from "../custom_modules/data/entity/dto/SignatureDTO";
import {SignedKeyDTO} from "../custom_modules/data/entity/dto/SignedKeyDTO";
import {KeyDTO} from "../custom_modules/data/entity/dto/KeyDTO";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class SignedKeyService {

    constructor() {

    }

    public generateSignedKey(username: String, key: KeyDTO): SignedKeyDTO {
        // generate signature
        let stringSignature = "";
        let signature = new SignatureDTO(stringSignature, username, "base64");
        let signedKey = new SignedKeyDTO(key, signature);
        return signedKey;
    }

    public publishSignedKeyIntoTheNetwork(username: String, signedKey: SignedKeyDTO, callback) {
        kademlia.storeValue(username, signedKey, ValueTypeEnum.SIGNED_KEY, global.SignedKeyManager, () => {
            callback();
        });
    }

    public getUsersSignedKey(username: String, callback: (result: SignedKeyDTO) => void) {
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


export default new SignedKeyService();

