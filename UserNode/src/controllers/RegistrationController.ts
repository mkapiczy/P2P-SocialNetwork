import {Router, Request, Response} from 'express';

const HttpStatus = require("http-status-codes");

class RegistrationController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.get);
        this.router.post("/", this.post);
    }

    get(request, response) {
        console.log("Registration get received");
    };

    post(request, response){
        console.log("Registration post received");
    };

}

export default new RegistrationController().router;

