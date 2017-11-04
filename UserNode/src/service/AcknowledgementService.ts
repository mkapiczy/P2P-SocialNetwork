import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import {SignatureDTO} from "../custom_modules/data/entity/dto/SignatureDTO";
import {SignedKeyDTO} from "../custom_modules/data/entity/dto/SignedKeyDTO";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class AcknowledgementService {

    constructor() {

    }

    public getPendingAcknowledgementMessages(myUsername: String, callback: (result: AcknowledgmentRerquestMsg) => void) {
        kademlia.findValue(myUsername, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (ackMsg, nodeId) => {
            if (ackMsg) {
                console.log("Ackwnoledgement message found: " + ackMsg + "  nodeId: " + nodeId);
                callback(ackMsg)
            } else {
                callback(null);
            }
        });
    }

    public processAcknowledgementMessages(ackMsg: AcknowledgmentRerquestMsg, myUsername: String): void {
        let key = ackMsg.key;
        let userData = ackMsg.userData;
        if (this.validateAcknowldgementUserData(userData)) {
            // sign the key
            let stringSignature = "";

            // publish it into the netwok
            let signature = new SignatureDTO(stringSignature, myUsername, "base64");
            let signedKey = new SignedKeyDTO(key, signature);
            kademlia.storeValue(userData.username, signedKey, ValueTypeEnum.SIGNED_KEY, global.SignedKeyManager, (closestNodes) => {

            });
        } else {
            console.log("I do not know this user: + " + userData.username + " !");
        }
    }

    public isAcknowledged(username: String, callback: (result: Boolean) => void) {
        kademlia.findValue(username, ValueTypeEnum.SIGNED_KEY, (value, nodeId) => {
            if (value) {
                console.log("User is acknowledged: " + value + "  nodeId: " + nodeId);
                callback(true)
            } else {
                callback(false);
            }
        });

    }

    private validateAcknowldgementUserData(userData: UserDataDTO): Boolean {
        // validate if you know the user
        return true;
    }


}


export default new AcknowledgementService();

