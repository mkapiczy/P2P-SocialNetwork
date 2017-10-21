// Import everything from express and assign it to the express variable
import * as express from 'express';

// Import IndexController from controllers entry point
import {IndexController} from './controllers/indexController';
import {DataController} from "./controllers/dataController";
import {FindController} from "./controllers/findController";
import {KademliaController} from "./controllers/kademliaController";
import {NotificationController} from "./controllers/notificationController";
import {StoreController} from "./controllers/testController";

// Create a new express application instance
const app: express.Application = express();

//Setup Global
const dotenv = require("dotenv");
dotenv.load();

const t = require("./custom_modules/app");
const nodeIpAddr = process.env.NODE_IP;
const nodePort = process.argv.slice(2)[0];
t.init(nodeIpAddr, nodePort);

console.log("Test Global node id:" + global.node.id);

//public purposes
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views/"));

// Routes
app.use('/', IndexController);
app.use('/api/data', DataController);
app.use('/api/find', FindController);
app.use('/api/kademlia', KademliaController);
app.use('/api/notification', NotificationController);
app.use('/api/store', StoreController);

// Serve the application at the given port
app.listen(nodePort, err => {
    if (err) {
        return console.log("Error: ", err);
    }

    console.log(`Server is listening on port ${nodePort}`);
});