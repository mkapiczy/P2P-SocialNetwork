const express = require("express");
const HttpStatus = require("http-status-codes");
const bodyParser = require("body-parser");
const path = require("path");
let swaggerTools = require("swagger-tools");
let YAML = require("yamljs");

const app = express();
const Node = require("./custom_modules/kademlia/node");
const Kademlia = require("./custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const communicator = require('./custom_modules/communicator');
const StoredValueType = require("./enum/storedValueType");

const kademliaApiPath = "/api/kademlia/";
const apiPath = "/api/";

//public purposes
app.set("views", path.join(__dirname, ".././views/"));
app.use("/views", express.static(path.join(__dirname, ".././views")));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views/"));

let args = process.argv.slice(2);
const port = args[0];

/// VIEWS ///
app.get("/", (request, response) => {
    response.render("index", {
        title: "Hey!",
        message: "This works :-)",
        node: global.node,
        buckets: global.BucketManager.buckets
    });
});

app.get("/data", (request, response) => {
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
});

app.get("/data/measurements", (request, response) => {
    let measurementsForView = [];

    global.MeasurementManager.dataStorage.forEach(function (value, key) {
        measurementsForView.push({key: key, value: value});
    });

    response.send(measurementsForView);
});

app.get("/find", (request, response) => {
    response.render("findView", {
        title: "Hey!",
        message: "This works :-)",
        node: global.node,
    });
});

/// KADEMLIA ENDPOINTS ///

app.get(kademliaApiPath + "info/ping", (request, response) => {
    console.log("Ping message from node ", request.body.nodeId);
    console.log("Buckets", global.BucketManager.buckets);
    requestNode = new Node(
        request.body.nodeId,
        request.body.nodeIP,
        request.body.nodePort
    );

    kademlia.handlePing(requestNode, () => {
        response.status(HttpStatus.OK);
        response.json({
            nodeId: global.node.id,
            rpcId: request.body.rpcId,
            msg: "PONG"
        });
        console.log("Buckets", global.BucketManager.buckets);
    });
});

//FIND NODE ENDPOINT
app.get(kademliaApiPath + "nodes/:id", (request, response) => {
    console.log("Find node message from node ", request.body.nodeId);
    console.log("closest to ", request.params.id);
    console.log("Buckets", global.BucketManager.buckets);
    requestNode = new Node(
        request.body.nodeId,
        request.body.nodeIP,
        request.body.nodePort
    );

    kademlia.getKClosestNodes(request.params.id, requestNode, (closestNodes) => {
        response.status(HttpStatus.OK);
        response.setHeader("Content-Type", "application/json");
        response.json({
            nodeId: global.node.id,
            rpcId: request.body.rpcId,
            closestNodes: closestNodes
        });
    });
});

//STORE VALUE ENDPOINT
app.post(kademliaApiPath + "data/endpoints", (request, response) => {
    let endpoint = request.body.endpoint;

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

    kademlia.storeValue(endpoint, endpoint, StoredValueType.ENDPOINT, global.EndpointManager, (closestNode) => {
        console.log("Send notification to: " + closestNode.id);
        communicator.notifyClosestNode(closestNode, endpoint, () => {
        });
        response.status(HttpStatus.OK);
        response.send("post received!");
    });

});

app.get(kademliaApiPath + "data/endpoints", (request, response) => {
    console.log("Find value request received: " + request.query.key);
    key = request.query.key;
    value = global.EndpointManager.findValueByNonHashedKey(key);
    if (value) {
        response.send({value: value, node: global.node.id});
    } else {
        kademlia.findValue(key, (value, nodeId) => {
            response.send({value: value, node: nodeId});
        });
    }
});


/// LOCAL ENDPOINTS ///

app.get(apiPath + "store/data/endpoints", (request, response) => {
    value = global.EndpointManager.findValueByHashedKey(request.body.key);
    response.json({value: value});
});

app.post(apiPath + "store/data/endpoints", (request, response) => {
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
});

app.post(apiPath + "store/data/measurement", (request, response) => {
    console.log("Store measurement request received!");
    global.MeasurementManager.storeValue(request.body.key, request.body.value);
    global.MeasurementManager.printData();
    response.status(HttpStatus.OK);
    response.send("Measurement stored!");
});

app.post(apiPath + "notification", (request, response) => {
    console.log("Notification received");
    global.WoTManager.addWoTDevice(request.body.endpoint);
    response.status(HttpStatus.OK);
    response.send("Notification acknowledged!");
});

app.get("/test/wotData", (request, response) => {
    if (request.accepts('json')) {
        response.status(HttpStatus.OK);
        response.json({currentTime: Date.now(), humidity: 34, temperature: 20});
    } else {
        console.log("Wrong accept format");
    }

});

let swaggerDoc = YAML.load("openapi.yaml");
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
    app.use(middleware.swaggerUi());
});

app.listen(port, err => {
    if (err) {
        return console.log("Error: ", err);
    }

    console.log(`Server is listening on port ${port}`);
});

module.exports = app;
