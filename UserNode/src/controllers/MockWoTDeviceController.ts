import {Router, Request, Response} from 'express';

const HttpStatus = require("http-status-codes");

class MockWotDeviceController {
    router: Router = Router();

    constructor() {
        this.router.get("/wotData", this.getWotData);
    }

    getWotData(request, response) {
        if (request.accepts('json')) {
            response.status(HttpStatus.OK);
            response.json({currentTime: Date.now(), humidity: 34, temperature: 20});
        } else {
            console.log("Wrong accept format");
        }
    };

}

export default new MockWotDeviceController().router;
