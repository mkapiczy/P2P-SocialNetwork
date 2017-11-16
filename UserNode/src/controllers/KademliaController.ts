import {Router, Request, Response} from 'express';

const Kademlia = require("./../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const HttpStatus = require("http-status-codes");
const Node = require("./../custom_modules/kademlia/node");
const communicator = require("../custom_modules/kademlia/kademliaCommunicator");

import DataManagerIdentifier from "../custom_modules/data/manager/DataManagerIdentifier"


class KademliaController {
    router: Router = Router();

    constructor() {
        this.router.get("/info/ping", this.infoPing);
        this.router.get("/nodes/:id", this.findNode);
        this.router.post("/data/endpoints", this.storeValue);
    }

    infoPing(request, response) {
        console.log("Ping message from node ", request.body.nodeId);
        console.log("Buckets", global.BucketManager.buckets);
        let requestNode = new Node(
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

    }

    findNode(request, response) {
        console.log("Find node message from node ", request.body.nodeId);
        console.log("closest to ", request.params.id);
        console.log("Buckets", global.BucketManager.buckets);
        let requestNode = new Node(
            request.body.nodeId,
            request.body.nodeIP,
            request.body.nodePort
        );

        kademlia.getKClosestNodes(Number(request.params.id), requestNode, (closestNodes) => {
            response.status(HttpStatus.OK);
            response.setHeader("Content-Type", "application/json");
            response.json({
                nodeId: global.node.id,
                closestNodes: closestNodes,
                rpcId: request.body.rpcId,
            });
        });
    }

    //TODO Changed endpoint interfac e requests need to be adjusted. Instead of endpoint value and valueType
    storeValue(request, response) {
        const value = request.body.value;
        const valueType = request.body.valueType;

        const dataManager = DataManagerIdentifier.getDataManagerBasedOnDataType(valueType);

        kademlia.storeValue(value, value, valueType, dataManager, (closestNode) => {
            response.status(HttpStatus.OK);
            response.send("post received!");
        });
    }

}


export default new KademliaController().router;
