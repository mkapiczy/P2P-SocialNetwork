import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

import {IndexController} from './controllers/indexController';
import {DataController} from "./controllers/dataController";
import {FindController} from "./controllers/findController";
import {KademliaController} from "./controllers/kademliaController";
import {NotificationController} from "./controllers/notificationController";
import {StoreController} from "./controllers/storeController";
import {TestController} from "./controllers/testController";


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
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use("/views", express.static(path.join(__dirname, "./views")));
        this.express.set("view engine", "pug");
        this.express.set("views", path.join(__dirname, "./views/"));
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use('/', IndexController);
        this.express.use('/data', DataController);
        this.express.use('/find', FindController);
        this.express.use('/api/kademlia', KademliaController);
        this.express.use('/api/notification', NotificationController);
        this.express.use('/api/store', StoreController);
        this.express.use('/test', TestController);
    }

}

export default new Server().express;