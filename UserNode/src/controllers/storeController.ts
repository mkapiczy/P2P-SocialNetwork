import {Router, Request, Response} from 'express';

const router: Router = Router();
const apiPath = "";

const Kademlia = require("./custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const HttpStatus = require("http-status-codes");

router.get(apiPath + "store/data/endpoints", (request, response) => {
    let value = ""//global.EndpointManager.findValueByHashedKey(request.body.key);
    response.json({value: value});
});

router.post(apiPath + "store/data/endpoints", (request, response) => {
    console.log("Store endpoint request received!");
    let endpoint = request.body.value;
    //global.EndpointManager.storeValue(request.body.key, endpoint);
    setInterval(() => {
        kademlia.isGlobalNodeTheClosest(endpoint, (result) => {
            if (result) {
                console.log("I am the closest to the endpoint!");
                //global.WoTManager.addWoTDevice(endpoint);
            } else {
                console.log("I am not the closest to the endpoint");
                //global.WoTManager.removeWoTDevice(endpoint);
            }
        });
    }, 10000);
    response.status(HttpStatus.OK);
    response.send("Endpoint stored!");
});

router.post(apiPath + "store/data/measurement", (request, response) => {
    console.log("Store measurement request received!");
    //global.MeasurementManager.storeValue(request.body.key, request.body.value);
    //global.MeasurementManager.printData();
    response.status(HttpStatus.OK);
    response.send("Measurement stored!");
});

export const StoreController: Router = router;