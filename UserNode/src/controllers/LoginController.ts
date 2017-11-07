import {Router, Request, Response} from 'express';

const HttpStatus = require("http-status-codes");

class LoginController {
    router: Router = Router();

    constructor() {
        this.router.post("/", this.login);
    }

    login(request, response) {
        let username = request.body.username;

        response.send('I received username: ' + username);

    }


}

export default new LoginController().router;