// Import everything from express and assign it to the express variable
import * as express from 'express';

// Import IndexController from controllers entry point
import {IndexController} from './controllers/indexController';

// Create a new express application instance
const app: express.Application = express();

//Setup Glob al
const global = require("./custom_modules/app");
const nodeIpAddr = process.env.NODE_IP;
const nodePort = process.argv.slice(2)[0];
global.init(nodeIpAddr, nodePort);

// The port the express app will listen on
const port: number = process.env.PORT || 8000;

// Mount the WelcomeController at the /welcome route
app.use('/', IndexController);

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

// Serve the application at the given port
app.listen(port, err => {
    if (err) {
        return console.log("Error: ", err);
    }

    console.log(`Server is listening on port ${port}`);
});