import {Router, Request, Response} from 'express';

const router: Router = Router();
const HttpStatus = require("http-status-codes");
router.get("/test/wotData", (request, response) => {
    if (request.accepts('json')) {
        response.status(HttpStatus.OK);
        response.json({currentTime: Date.now(), humidity: 34, temperature: 20});
    } else {
        console.log("Wrong accept format");
    }

});

export const StoreController: Router = router;