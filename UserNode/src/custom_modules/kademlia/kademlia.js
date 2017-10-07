const DataPublisher = require("../kademlia/dataPublisher");
const constants = require("../../config/constants");
const dataPublisher = new DataPublisher();
const util = require("../util");

function Kademlia() {
}

Kademlia.prototype.storeValue = function (key, value, valueType, dataManager, callback) {
    dataManager.storeValueWithKeyHashing(key, value);
    dataPublisher.publishToKNodesClosestToTheKey(key, value, valueType, closestNodes => {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        closestNodes = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, closestNodes);
        callback(closestNodes[0]);
    });
};

Kademlia.prototype.findValue = function (key, callback) {
    dataPublisher.findValue(key, (nodeId, value) => {
        if (value) {
            console.log("Value for the key " + key + " found in node " + nodeId);
            console.log("Value: " + value);
            callback(value, nodeId);
        } else {
            console.log("Value for the key " + key + " not found!");
            callback("", "");
        }
    });
};

Kademlia.prototype.getKClosestNodes = function (id, requestNode, callback) {
    global.BucketManager.updateNodeInBuckets(requestNode);
    let closestNodes = global.BucketManager.getClosestNodes(id);
    callback(closestNodes);
};

Kademlia.prototype.handlePing = function (node, callback) {
    global.BucketManager.updateNodeInBuckets(node);
    callback();
};

Kademlia.prototype.isGlobalNodeTheClosest = function(endpoint, callback){
    dataPublisher.findClosestNodeToTheKye(endpoint, (closestNode)=>{
        callback(closestNode.id === global.node.id);
    });
};

module.exports = Kademlia;