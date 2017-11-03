import {Router, Request, Response} from 'express';

const Kademlia = require("./../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const HttpStatus = require("http-status-codes");

class DataController {
    router: Router = Router();

    constructor() {
        this.router.get("/key", this.getAckMessage);
        this.router.post("/key", this.storeAckMessage);
    }

    getAckMessage(request, response) {
        let value = global.AcknowledgmentRequestManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
    };

    storeAckMessage(request, response) {
        console.log("Store ack message request received!");
        console.log("Key: " + request.body.key + " | value: " + request.body.value);
        global.AcknowledgmentRequestManager.storeValue(request.body.key, request.body.value);
        response.status(HttpStatus.OK);
        response.send("Measurement stored!");
    }
}

export default new DataController().router;