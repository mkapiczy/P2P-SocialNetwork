import {Router, Request, Response} from 'express';
const HttpStatus = require("http-status-codes");

const router: Router = Router();

router.post("/notification", (request, response) => {
    console.log("Notification received");
    global.WoTManager.addWoTDevice(request.body.endpoint);
    response.status(HttpStatus.OK);
    response.send("Notification acknowledged!");
});

export const NotificationController: Router = router;