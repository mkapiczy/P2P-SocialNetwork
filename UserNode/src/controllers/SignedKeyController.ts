import {Router, Request, Response} from 'express';
const HttpStatus = require("http-status-codes");

class SignedKeyController {
    router: Router = Router();

    constructor() {
        this.router.get("/key", this.getPublicKey);
        this.router.post("/key", this.storePublicKey);
    }

    getPublicKey(request, response) {
        let value = global.SignedKeyManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
    };

    storePublicKey(request, response) {
        console.log("Store signed key request received!");
        console.log("Key: " + request.body.key + " | value: " + request.body.value);
        global.SignedKeyManager.storeValue(request.body.key, request.body.value);
        response.status(HttpStatus.OK);
        response.send("Signed key stored!");
    }
}

export default new SignedKeyController().router;