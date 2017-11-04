const request = require("request");
const util = require("../util");
const Node = require("./node");
const {ValueTypeEnum} = require("../enum/ValueTypeEnum");
import {NodeStateEnum} from "../enum/NodeStateEnum";

exports.sendPing = function (senderNode, nodeToPing, callBack) {
    let requestRpcId = util.createRandomAlphaNumericIdentifier(20);
    let requestOptions = {
        method: "GET",
        uri: nodeToPing.ipAddr + ":" + nodeToPing.port + "/api/kademlia/info/ping",
        body: {
            nodeId: senderNode.id,
            nodeIP: senderNode.ipAddr,
            nodePort: senderNode.port,
            rpcId: requestRpcId
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            console.log("Node with id: " + nodeToPing.id + " removed from the buckets!");
            BucketManager.removeNodeFromTheBuckets(nodeToPing);
            callBack(NodeStateEnum.NOT_ALIVE);
        } else {
            console.log(response.body);
            let responseRpcId = response.body.rpcId;
            if (responseRpcId === requestRpcId) {
                console.log("Now I ping: " + nodeToPing.port);
                let nodeToUpdate = new Node(nodeToPing.id, nodeToPing.ipAddr, nodeToPing.port);
                global.BucketManager.updateNodeInBuckets(nodeToUpdate);
                callBack(NodeStateEnum.ALIVE);
            }
        }
    });
};

exports.sendFindNode = function (closestToId, recipientNode, callBack) {
    console.log("Buckets before find node", global.BucketManager.buckets);
    let requestRpcId = util.createRandomAlphaNumericIdentifier(20);

    let requestOptions = {
        method: "GET",
        uri: recipientNode.ipAddr +
        ":" +
        recipientNode.port +
        "/api/kademlia/nodes/" + closestToId,
        body: {
            nodeId: global.node.id,
            nodeIP: global.node.ipAddr,
            nodePort: global.node.port,
            rpcId: requestRpcId
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            BucketManager.removeNodeFromTheBuckets(recipientNode);
            callBack(NodeStateEnum.NOT_ALIVE);
        } else {
            console.log("Received closest nodes:", response.body.closestNodes);
            if (response.body.rpcId === requestRpcId) {
                global.BucketManager.updateNodeInBuckets(recipientNode);
                let closestNodes = response.body.closestNodes;
                closestNodes.forEach(function (node) {
                    if (node.id !== global.node.id) {
                        exports.sendPing(global.node, node, function (result) {
                            //Adding is handled in ping function
                        });
                    }
                }, this);
                console.log("Buckets after find node", global.BucketManager.buckets);
                callBack(NodeStateEnum.ALIVE);
            }
        }
    });
};

//Function which returns closest nodes istead of adding it to bucket
exports.sendGetClosestNodesRequest = function (closestToId, recipientNode, callBack) {
    console.log("Buckets before find node", global.BucketManager.buckets);
    let requestRpcId = util.createRandomAlphaNumericIdentifier(20);

    let requestOptions = {
        method: "GET",
        uri: recipientNode.ipAddr +
        ":" +
        recipientNode.port +
        "/api/kademlia/nodes/" + closestToId,
        body: {
            nodeId: global.node.id,
            nodeIP: global.node.ipAddr,
            nodePort: global.node.port,
            rpcId: requestRpcId
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            BucketManager.removeNodeFromTheBuckets(recipientNode);
            callBack(NodeStateEnum.NOT_ALIVE);
        } else {
            callBack(response.body.closestNodes);
        }
    });
};

exports.sendStoreValue = function (recipientNode, key, value, valueType, callBack) {
    console.log("Send store value called for value type: " + valueType);
    let uri = createUriBasedOnValueType(valueType, recipientNode);
    console.log("Store value uri: " + uri);
    let requestRpcId = util.createRandomAlphaNumericIdentifier(20);
    let requestOptions = {
        method: "POST",
        uri: uri,
        body: {
            nodeId: global.node.id,
            nodeIP: global.node.ipAddr,
            nodePort: global.node.port,
            rpcId: requestRpcId,
            key: key,
            value: value,
            valueType: valueType
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            BucketManager.removeNodeFromTheBuckets(recipientNode);
            callBack(NodeStateEnum.NOT_ALIVE);
        } else {
            console.log("Response in communicator: " + response);
            callBack(NodeStateEnum.ALIVE);
        }
    });
};

exports.sendFindValue = function (recipientNode, key, valueType, callBack) {
    console.log("Send find value was called!");
    let requestRpcId = util.createRandomAlphaNumericIdentifier(20);
    let uri = createUriBasedOnValueType(valueType, recipientNode);
    let requestOptions = {
        method: "GET",
        uri: uri,
        body: {
            nodeId: global.node.id,
            nodeIP: global.node.ipAddr,
            nodePort: global.node.port,
            rpcId: requestRpcId,
            key: key
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            BucketManager.removeNodeFromTheBuckets(recipientNode);
            callBack(NodeStateEnum.NOT_ALIVE);
        } else {
            callBack(response.body.value);
        }
    });
};

let createUriBasedOnValueType = function (valueType, recipientNode) {
    let uri = recipientNode.ipAddr + ":" + recipientNode.port;
    if (valueType === ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST) {
        uri += "/data/key";
    } else if(valueType ===ValueTypeEnum.SIGNED_KEY){
        uri += "/data/ack";
    }
    return uri;
};