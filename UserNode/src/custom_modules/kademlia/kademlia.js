const NodeCommunicator = require("./NodeCommunicator");
const constants = require("../../config/constants");
const util = require("../util");

function Kademlia() {
}

Kademlia.prototype.storeValue = function (key, value, valueType, dataManager, callback) {
    console.log("Kademlia store value for key: " + key + " value: " + value);
    dataManager.storeValueWithKeyHashing(key, value);
    NodeCommunicator.publishToKNodesClosestToTheKey(key, value, valueType, closestNodes => {
        if (closestNodes.length > 0) {
            let hashedKey = util.createHashFromKey(key, constants.B / 8);
            closestNodes = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, closestNodes);
            callback(closestNodes[0]);
        } else {
            callback(false);
        }
    });
};

Kademlia.prototype.findValue = function (key, valueType, callback, hashed = false) {
    NodeCommunicator.findValue(key, valueType, (nodeId, value) => {
        if (value) {
            console.log("Value for the key " + key + " found in node " + nodeId);
            console.log("Value: " + JSON.stringify(value));
            callback(value, nodeId);
        } else {
            console.log("Value for the key " + key + " not found!");
            callback("", "");
        }
    }, hashed);
};

Kademlia.prototype.getKClosestNodes = function (id, requestNode, callback) {
    let closestNodes = global.BucketManager.getClosestNodes(id);
    callback(closestNodes);
};

Kademlia.prototype.handlePing = function (node, callback) {
    global.BucketManager.updateNodeInBuckets(node);
    callback();
};

Kademlia.prototype.removeValue = function (key, msg, valueType, datamanager, callback) {
    msg.isValid = false;
    this.storeValue(key, msg, valueType, datamanager, callback);

};

Kademlia.prototype.isGlobalNodeTheClosest = function (endpoint, callback) {
    NodeCommunicator.findClosestNodeToTheKye(endpoint, (closestNode) => {
        callback(closestNode.id === global.node.id);
    });
};

module.exports = Kademlia;