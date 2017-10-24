import {Router, Request, Response} from 'express';

const HttpStatus = require("http-status-codes");

class NotificationController {
    router: Router = Router();

    constructor() {
        this.router.get("/notification", this.handleNotification);
    }

    handleNotification(request, response) {
        console.log("Notification received");
        global.WoTManager.addWoTDevice(request.body.endpoint);
        response.status(HttpStatus.OK);
        response.send("Notification acknowledged!");
    };

}

export default new NotificationController().router;

