import {Router, Request, Response} from 'express';

const HttpStatus = require("http-status-codes");

class AuthenticationController {
    router: Router = Router();

    constructor() {
        this.router.post("/authenticate", this.authenticate);
        this.router.post("/authenticate/user", this.authenticateAnotherUser);
    }

    authenticate(request, response) {
        // get your signed public key from the network
        // sign it with your private key
        // send it to the network for authentication request
        // w8 for the response
        // if successful create session token

    }

    authenticateAnotherUser(request, response) {
        // Get from request public key signed with two signatures
        // Find public key of request node in the network
        // validate requesting node signature
        // Find public key of the vouching node
        // validate vouching signature
        // if ok return authentication successfull
    }

}

export default new AuthenticationController().router;