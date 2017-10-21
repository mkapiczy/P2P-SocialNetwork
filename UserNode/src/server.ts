// Import everything from express and assign it to the express variable
import * as express from 'express';

// Import IndexController from controllers entry point
import {IndexController} from './controllers/indexController';

// Create a new express application instance
const app: express.Application = express();

// The port the express app will listen on
const port: number = process.env.PORT || 3000;

// Mount the WelcomeController at the /welcome route
app.use('/', IndexController);

//public purposes
const path = require("path");
const bodyParser = require("body-parser");
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

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});