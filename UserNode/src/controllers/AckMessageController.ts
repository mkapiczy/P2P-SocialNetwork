import {Router, Request, Response} from 'express';
import AcknowledgementService from "../service/AcknowledgementService";

const HttpStatus = require("http-status-codes");

class AckMessageController {
    router: Router = Router();

    constructor() {
        this.router.get("/ack", this.getAckMessage);
        this.router.get("/ack/pending_messages", this.getPendingMessages);
        this.router.post("/ack", this.storeAckMessage);
        this.router.post("/ack/process", this.processUserAckMessages);
    }

    getAckMessage(request, response) {
        let value = global.AcknowledgmentRequestManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
    };

    getPendingMessages(request, response) {
        let username = request.query.username;
        let messages = AcknowledgementService.getPendingAcknowledgementMessages(username, (messages) => {
            response.json({messages: messages});
        });
    };

    processUserAckMessages(request, response) {
        let username = request.query.username;
        console.log("Process acknowledgement messages for: " + username);
        AcknowledgementService.getPendingAcknowledgementMessages(username, (pendingAckMessages) => {
            if (pendingAckMessages) {
                pendingAckMessages.forEach(msg =>{
                    AcknowledgementService.processAcknowledgementMessage(msg, username);
                }) ;
            }
            response.send("");
        });
    };

    storeAckMessage(request, response) {
        console.log("Store ack message request received!");
        console.log("KeyDTO: " + request.body.key + " | value: " + request.body.value);
        global.AcknowledgmentRequestManager.storeValue(request.body.key, request.body.value);
        response.status(HttpStatus.OK);
        response.send("Ack message stored!");
    }
}

export default new AckMessageController().router;