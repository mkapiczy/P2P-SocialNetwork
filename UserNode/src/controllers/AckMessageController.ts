import {Router, Request, Response} from 'express';
const HttpStatus = require("http-status-codes");

class AckMessageController {
    router: Router = Router();

    constructor() {
        this.router.get("/ack", this.getAckMessage);
        this.router.post("/ack", this.storeAckMessage);
    }

    getAckMessage(request, response) {
        let value = global.AcknowledgmentRequestManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
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