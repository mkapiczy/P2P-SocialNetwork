import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import IndexController from './controllers/IndexController';
import DataController from "./controllers/DataController";
import FindController from "./controllers/FindController";
import KademliaController from "./controllers/KademliaController";
import NotificationController from "./controllers/NotificationController";
import MockWoTDeviceController from "./controllers/MockWoTDeviceController";


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
        this.express.use(express.static(path.join(__dirname, "/views/css")));
        this.express.set("view engine", "pug");
    }

    // Configure API endpoints.
    private routes(): void {

        this.express.use('/', IndexController);
        this.express.use('/data', DataController);
        this.express.use('/find', FindController);
        this.express.use('/api/kademlia', KademliaController);
        this.express.use('/api/notification', NotificationController);
        this.express.use('/test', MockWoTDeviceController);
    }

}

export default new Server().express;