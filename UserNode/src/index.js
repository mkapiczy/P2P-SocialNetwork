// node_modules
const express = require("express");
const dotenv = require("dotenv");

// custom config modules
const httpApp = require("./server");

// custom modules
const app = require("./custom_modules/app");
const webApp = express();

webApp.use(httpApp);

// necessary to read environment parameters from .env file
dotenv.load();

const nodeIpAddr = process.env.NODE_IP;
const nodePort = process.argv.slice(2)[0];

app.init(nodeIpAddr, nodePort);
