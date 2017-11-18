import {Router, Request, Response} from 'express';
import AcknowledgementService from "../service/AcknowledgementService";

const HttpStatus = require("http-status-codes");

class AckMessageController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.getAckMessage);
        this.router.get("/pending/messages", this.getPendingMessages);
        this.router.get("/pending/number", this.getPendingMessagesNumber);
        this.router.post("/", this.storeAckMessage);
        this.router.post("/process", this.processUserAckMessages);
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

    getPendingMessagesNumber(request, response) {
        let username = request.query.username;
        let messages = AcknowledgementService.getPendingAcknowledgementMessages(username, (messages) => {
            console.log(messages.length);
            response.json({"numberOfPendingMessages": messages.length});
        });
    };

    processUserAckMessages(request, response) {
        let username = request.body.username;
        let myUsername = request.body.myUsername;
        let isConfirmed = request.body.isConfirmed;
        console.log("Process acknowledgement messages for: " + username);
        AcknowledgementService.getPendingAcknowledgementMessages(myUsername, (pendingAckMessages) => {
            console.log("Pending messages: " + pendingAckMessages);
            if (pendingAckMessages) {
                pendingAckMessages.forEach(msg => {
                    if (msg.userData.username === username) {
                        AcknowledgementService.processAcknowledgementMessage(msg, username, isConfirmed);
                    }
                });
            } else {
                console.log("No messages for " + username);
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