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
