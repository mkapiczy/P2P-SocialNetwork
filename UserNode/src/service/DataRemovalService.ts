import {Request, Response, Router} from 'express';
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";

class DataRemovalService {

    constructor() {
    }

    public removeRequestByUsername(username: String) {
        //Get all messages addressed to me
        let messages = global.AcknowledgmentRequestManager.findAllValuesForRelatedKeys(global.node.id);
        let msgNotFromUser = [];

        messages.forEach((msg) => {
            if (msg.userData.username != username) {
                msgNotFromUser.push(msg);
            }
        });

        messages.forEach((msg) => {
            console.log("Delete ack with key:" + msg.id);
            global.AcknowledgmentRequestManager.deleteValueWithKeyHashing(msg.id);
        });

        let iterator = 0;
        msgNotFromUser.forEach((msg: AcknowledgmentRerquestMsg) => {
            let nextId = global.node.id+iterator.toString();
            console.log("Data Removal, next id: " + nextId);
            let nextMsg = new AcknowledgmentRerquestMsg(nextId, msg.key, msg.userData);
            global.AcknowledgmentRequestManager.storeValueWithKeyHashing(nextId, nextMsg);
            iterator++;
        });
    }


}


export default new DataRemovalService();

