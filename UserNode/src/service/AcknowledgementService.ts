import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";
import SignedKeyService from "./SignedKeyService";
import KademliaMsgManager from '../custom_modules/kademlia/KademliaValueManager'
import {KeyDTO} from "../custom_modules/data/entity/dto/KeyDTO";
import DataRemovalService from "./DataRemovalService";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class AcknowledgementService {

    constructor() {
    }

    public publiskAcknowledgementRequestMsgIntoTheNetwork(approverId: String, key: KeyDTO, userData: UserDataDTO, callback) {
        KademliaMsgManager.getAvailableKey(approverId, 0, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (availableKey) => {
            let ackMsg = new AcknowledgmentRerquestMsg(availableKey, key, userData);
            console.log("Value stored with the key " + availableKey);
            kademlia.storeValue(availableKey, ackMsg, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, global.AcknowledgmentRequestManager, () => {
                callback();
            });
        });
    }


    public getPendingAcknowledgementMessages(myUsername: String, callback: (result: Array<AcknowledgmentRerquestMsg>) => void) {
        let localMessages = global.AcknowledgmentRequestManager.findAllValuesForRelatedKeys(myUsername);
        if (localMessages && localMessages.length > 0) {
            callback(localMessages);
        } else {
            KademliaMsgManager.getAllValuesForRelatedKeys(myUsername, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, (messages) => {
                this.addMessagesToLocalBucket(messages);
                callback(this.removeInvalidMessages(messages));
            });
        }
    }

    public processAcknowledgementMessage(ackMsg: AcknowledgmentRerquestMsg, fromUsername: String, isConfirmed: boolean): void {
        let key = ackMsg.key;
        let userData = ackMsg.userData;
        console.log("Process ack: " + fromUsername);
        if (this.validateAcknowldgementUserData(userData)) {
            if (isConfirmed) {
                let signedKey = SignedKeyService.generateSignedKey(fromUsername, key);
                SignedKeyService.publishSignedKeyIntoTheNetwork(userData.username, signedKey, () => {
                    console.log("Signed Key for user " + userData.username + " published into the network");
                    DataRemovalService.removeRequestsByUsername(fromUsername);
                });
            } else {
                DataRemovalService.removeRequestsByUsername(fromUsername);
            }

        } else {
            console.log("I do not know this user: + " + userData.username + " !");
        }
    }

    public isAcknowledged(username: String, callback: (result: Boolean) => void) {
        SignedKeyService.getUsersSignedKey(username, true, (signedKey) => {
            if (signedKey) {
                console.log("User is acknowledged: " + signedKey);
                callback(true)
            } else {
                callback(false);
            }
        });
    }

    private removeInvalidMessages(messages: Array<AcknowledgmentRerquestMsg>) {
        let validMessages = [];
        if (messages && messages.length > 0) {
            messages.forEach((msg) => {
                if (msg.isValid) {
                    validMessages.push(msg);
                }
            });
        }
        return validMessages;
    }

    private addMessagesToLocalBucket (messages) {
        messages.forEach((msg) => {
            global.AcknowledgmentRequestManager.storeValueWithKeyHashing(msg.id, msg);
        });
    }

    private validateAcknowldgementUserData(userData: UserDataDTO): Boolean {
        // validate if you know the user
        return true;
    }


}


export default new AcknowledgementService();

