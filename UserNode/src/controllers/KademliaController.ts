import {Router, Request, Response} from 'express';

const Kademlia = require("./../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const HttpStatus = require("http-status-codes");
const Node = require("./../custom_modules/kademlia/node");
const StoredValueType = require("./../enum/storedValueType");
const communicator = require('./../custom_modules/communicator');

const router: Router = Router();

class KademliaController {
    router: Router = Router();

    constructor() {
        this.router.get("/info/ping", this.infoPing);
        this.router.get("/nodes/:id", this.findNode);
        this.router.post("/data/endpoints", this.storeValue);
        this.router.get("/data/endpoints", this.findEndpointValue);
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

        kademlia.getKClosestNodes(request.params.id, requestNode, (closestNodes) => {
            response.status(HttpStatus.OK);
            response.setHeader("Content-Type", "application/json");
            response.json({
                nodeId: global.node.id,
                rpcId: request.body.rpcId,
                closestNodes: closestNodes
            });
        });
    }

    storeValue(request, response) {
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
    }

    findEndpointValue(request, response) {
        console.log("Find value request received: " + request.query.key);
        const key = request.query.key;
        let value = global.EndpointManager.findValueByNonHashedKey(key);
        if (value) {
            response.send({value: value, node: global.node.id});
        } else {
            kademlia.findValue(key, (value, nodeId) => {
                response.send({value: value, node: nodeId});
            });
        }
    }
}


export default new KademliaController().router;
