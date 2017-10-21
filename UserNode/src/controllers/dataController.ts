import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get("/data", (request, response) => {
    let dataForView = [];
    /*global.EndpointManager.dataStorage.forEach(function (value, key) {
        dataForView.push({key: key, value: value});
    });*/

    //console.log("MEASUREMENT MANAGER: " + global.MeasurementManager.dataStorage);
    response.render("dataView", {
        title: "Hey!",
        message: "This works :-)",
        //node: global.node,
        dataStorage: dataForView,
    });
});

router.get("/data/measurements", (request, response) => {
    let measurementsForView = [];

    /*global.MeasurementManager.dataStorage.forEach(function (value, key) {
        measurementsForView.push({key: key, value: value});
    });*/

    response.send(measurementsForView);
});

export const DataController: Router = router;