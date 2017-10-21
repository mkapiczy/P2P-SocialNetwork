import {Router, Request, Response} from 'express';
const HttpStatus = require("http-status-codes");

const router: Router = Router();
let apiPath = "";
router.post(apiPath + "notification", (request, response) => {
    console.log("Notification received");
    global.WoTManager.addWoTDevice(request.body.endpoint);
    response.status(HttpStatus.OK);
    response.send("Notification acknowledged!");
});

export const NotificationController: Router = router;