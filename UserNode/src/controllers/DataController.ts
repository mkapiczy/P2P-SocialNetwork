import {Router, Request, Response} from 'express';

const Kademlia = require("./../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const HttpStatus = require("http-status-codes");

class DataController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.dataView);
        this.router.get("/endpoints", this.getEndpointData);
        this.router.get("/measurements", this.getMeasurementsData);
        this.router.post("/endpoints", this.storeEndpointData);
        this.router.post("/measurement", this.storeMeasurementData);
    }

    dataView(request, response) {
        let dataForView = [];
        global.EndpointManager.dataStorage.forEach(function (value, key) {
            dataForView.push({key: key, value: value});
        });

        console.log("MEASUREMENT MANAGER: " + global.MeasurementManager.dataStorage);
        response.render("dataView", {
            title: "Hey!",
            message: "This works :-)",
            node: global.node,
            dataStorage: dataForView,
        });
    };

    getEndpointData(request, response) {
        let value = global.EndpointManager.findValueByHashedKey(request.body.key);
        response.json({value: value});
    };

    storeEndpointData(request, response) {
        console.log("Store endpoint request received!");
        let endpoint = request.body.value;
        global.EndpointManager.storeValue(request.body.key, endpoint);
        setInterval(() => {
            kademlia.isGlobalNodeTheClosest(endpoint, (result) => {
                if (result) {
                    console.log("I am the closest to the endpoint!");
                    global.WoTManager.addWoTDevice(endpoint);
                } else {
                    console.log("I am not the closest to the endpoint");
                    global.WoTManager.removeWoTDevice(endpoint);
                }
            });
        }, 10000);
        response.status(HttpStatus.OK);
        response.send("Endpoint stored!");

    }

    getMeasurementsData(request, response) {
        let measurementsForView = [];

        global.MeasurementManager.dataStorage.forEach(function (value, key) {
            measurementsForView.push({key: key, value: value});
        });

        response.send(measurementsForView);

    }

    storeMeasurementData(request, response) {
        console.log("Store measurement request received!");
        global.MeasurementManager.storeValue(request.body.key, request.body.value);
        response.status(HttpStatus.OK);
        response.send("Measurement stored!");
    }
}

export default new DataController().router;