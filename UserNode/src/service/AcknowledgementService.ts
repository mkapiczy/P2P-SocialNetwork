import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";
import SignedKeyService from "./SignedKeyService";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class AcknowledgementService {

    constructor() {
    }

    public publiskAcknowledgementRequestMsgIntoTheNetwork(key: String, ackMsg: AcknowledgmentRerquestMsg, callback) {
        this.getAvailableKey(key, 0, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (availableKey) => {
            console.log("Value stored with the key " + availableKey);
            kademlia.storeValue(availableKey, ackMsg, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, global.AcknowledgmentRequestManager, () => {
                callback();
            });
        });
    }

    private getAvailableKey(key, keyIteration, valueType, callback) {
        let callKey = key + keyIteration.toString();
        console.log("Call key " + callKey + " check");
        kademlia.findValue(callKey, valueType, (value) => {
            if (value) {
                this.getAvailableKey(key, ++keyIteration, valueType, callback);
            } else {
                callback(callKey);
            }
        });
    }

    private getAllMessagesForRelatedKeys(key, valueType, callback) {
        let messages = [];
        this.getAllMessagesForRelatedKeysAccum(key, messages, valueType, (messages) => {
            callback(messages)
        });
    }

    private getAllMessagesForRelatedKeysAccum(key, messagesAccumulator, valueType, callback) {
        let itaration = messagesAccumulator.length;
        let callKey = key + itaration.toString();
        kademlia.findValue(callKey, valueType, (value) => {
            if (value) {
                messagesAccumulator.push(value);
                this.getAllMessagesForRelatedKeysAccum(key, messagesAccumulator, valueType, callback);
            } else {
                callback(messagesAccumulator);
            }
        });
    }

    public getPendingAcknowledgementMessages(myUsername: String, callback: (result: Array<AcknowledgmentRerquestMsg>) => void) {
        let localMessages = global.AcknowledgmentRequestManager.findAllValuesForRelatedKeys(myUsername);
        if (localMessages) {
            callback(localMessages);
        } else {
            this.getAllMessagesForRelatedKeys(myUsername, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (messages) => {
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

