import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import IndexController from './controllers/IndexController';
import AckMessageController from "./controllers/AckMessageController";
import KademliaController from "./controllers/KademliaController";
import RegistrationController from "./controllers/RegistrationController";
import SignedKeyController from "./controllers/SignedKeyController";
import LoginController from "./controllers/LoginController";

class Server {
    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(express.static(path.join(__dirname, "/views")));
        this.express.use(express.static(path.join(__dirname, "/views/js/components/registration")));
        this.express.use(express.static(path.join(__dirname, "/views/js/components/home")));
        this.express.use(express.static(path.join(__dirname, "/views/css")));
        this.express.set("view engine", "pug");
    }

    // Configure API endpoints.
    private routes(): void {

        this.express.use('/', IndexController);
        this.express.use('/register', RegistrationController);
        this.express.use('/api/kademlia', KademliaController);
        this.express.use('/data', AckMessageController);
        this.express.use('/data', SignedKeyController);
        this.express.use('/login', LoginController)
    }

}

export default new Server().express;