import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";
import SignedKeyService from "./SignedKeyService";
import KademliaMsgManager from '../custom_modules/kademlia/KademliaValueManager'

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class AcknowledgementService {

    constructor() {
    }

    public publiskAcknowledgementRequestMsgIntoTheNetwork(key: String, ackMsg: AcknowledgmentRerquestMsg, callback) {
        KademliaMsgManager.getAvailableKey(key, 0, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (availableKey) => {
            console.log("Value stored with the key " + availableKey);
            kademlia.storeValue(availableKey, ackMsg, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, global.AcknowledgmentRequestManager, () => {
                callback();
            });
        });
    }


    public getPendingAcknowledgementMessages(myUsername: String, callback: (result: Array<AcknowledgmentRerquestMsg>) => void) {
        let localMessages = global.AcknowledgmentRequestManager.findAllValuesForRelatedKeys(myUsername);
        if (localMessages) {
            callback(localMessages);
        } else {
            KademliaMsgManager.getAllValuesForRelatedKeys(myUsername, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (messages) => {
                callback(messages);
            });
        }
    }

    public processAcknowledgementMessage(ackMsg: AcknowledgmentRerquestMsg, myUsername: String): void {
        let key = ackMsg.key;
        let userData = ackMsg.userData;
        if (this.validateAcknowldgementUserData(userData)) {
            let signedKey = SignedKeyService.generateSignedKey(myUsername, key);
            SignedKeyService.publishSignedKeyIntoTheNetwork(userData.username, signedKey, () => {
                console.log("Signed Key for user " + userData.username + " published into the network");
                // remove pending messages for this username
            })
        } else {
            console.log("I do not know this user: + " + userData.username + " !");
        }
    }

    public isAcknowledged(username: String, callback: (result: Boolean) => void) {
        SignedKeyService.getUsersSignedKey(username, (signedKey) => {
            if (signedKey) {
                console.log("User is acknowledged: " + signedKey);
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

