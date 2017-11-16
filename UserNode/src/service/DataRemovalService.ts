import {Request, Response, Router} from 'express';
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();

class DataRemovalService {

    constructor() {
    }

    public removeRequestsByUsername(username: String) {
        //Get all messages addressed to me
        let messages = global.AcknowledgmentRequestManager.findAllValuesForRelatedKeys(global.node.id);
        let msgFromUser = [];

        messages.forEach((msg) => {
            if (msg.userData.username == username) {
                msgFromUser.push(msg);
            }
        });

        msgFromUser.forEach((msg) => {
            kademlia.removeValue(msg.id, msg, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, global.AcknowledgmentRequestManager, () => {
                console.log("Removed message: " + msg.id);
            });
        });
    }


}


export default new DataRemovalService();

