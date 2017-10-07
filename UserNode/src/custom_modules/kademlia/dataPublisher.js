const constants = require("../../config/constants");
const util = require("../util");
const communicator = require("./kademliaCommunicator");
const async = require("async");

function DataPublisher() {
}

DataPublisher.prototype.publishToKNodesClosestToTheKey = function (key, value, valueType, callback) {
    let shortlist = [];
    let hashedKey = util.createHashFromKey(key, constants.B / 8);
    console.log("Publish key: " + hashedKey);
    let alphaNodes = global.BucketManager.getAlphaClosestNodes(hashedKey);
    if (alphaNodes.length === 0) return;
    sendAsyncFindNodes(alphaNodes, hashedKey, shortlist, null, resultShortlist => {
        let nodesToStoreValue = removeGlobalNodeFromShortlist(resultShortlist);
        sendStoreValueToAllNodesInTheShortlist(nodesToStoreValue, hashedKey, value, valueType, () => {
            callback(resultShortlist);
        });
    });
};

DataPublisher.prototype.findClosestNodeToTheKye = function (key, callback) {
    let shortlist = [];
    let hashedKey = util.createHashFromKey(key, constants.B / 8);
    console.log("Publish key: " + hashedKey);
    let alphaNodes = global.BucketManager.getAlphaClosestNodes(hashedKey);
    if (alphaNodes.length === 0) return;
    sendAsyncFindNodes(alphaNodes, hashedKey, shortlist, null, resultShortlist => {
        resultShortlist = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, resultShortlist);
        callback(resultShortlist[0]);
    });
};

DataPublisher.prototype.findValue = function (name, callback) {
    console.log("Name is: " + name);
    const key = util.createHashFromKey(name, constants.B / 8);
    console.log("The key is: " + key);
    let shortlist = [];
    let alphaNodes = global.BucketManager.getAlphaClosestNodes(key);

    sendAsyncFindNodes(alphaNodes, key, shortlist, null, resultShortlist => {
        let iterator = 0;
        askNodeForAValue(resultShortlist, iterator, key, callback);
    });
};

askNodeForAValue = function (shortlist, iterator, key, callback) {
    nodeToAsk = shortlist[iterator];
    communicator.sendFindValue(nodeToAsk, key, value => {
        if (value) {
            callback(nodeToAsk.id, value);
        } else {
            if (iterator < shortlist.length - 1) {
                iterator++;
                askNodeForAValue(shortlist, iterator, key, callback);
            } else {
                console.log("All nodes asked and no value found!");
                callback(null, null);
            }
        }
    });
};

sendAsyncFindNodes = function (alphaNodes, hashedKey, shortlist, currentClosestNode, callback) {
    if (!currentClosestNode) {
        currentClosestNode = alphaNodes[0];
    }
    asyncCallsArray = prepareAsyncCalls(alphaNodes, hashedKey);

    async.parallel(asyncCallsArray, function (err, results) {
        if (err) {
            console.log("An error occured during async call: ", err);
        }

        results = mergeAsyncCallsResultsIntoOneArray(results);
        shortlist = updateShortlistAfterAsyncCalls(shortlist, alphaNodes, results);

        if (shouldUpdateClosestNode(shortlist, currentClosestNode, hashedKey)) {
            currentClosestNode = getNewClosestNode(shortlist, currentClosestNode, hashedKey);
            nextCallAlphaNodes = getNextCallAlphaNodesFromShortlist(shortlist);
            sendAsyncFindNodes(nextCallAlphaNodes, hashedKey, shortlist, currentClosestNode, callback);
        } else {
            shortlist = shortlist.slice(0, constants.k + 1); // +1 because we leave the global node inside.
            callback(shortlist);
        }
    });
};

prepareAsyncCalls = function (alphaNodes, hashedKey) {
    asyncCallsArray = [];
    alphaNodes.forEach(node => {
        asyncCallsArray.push(function (callback) {
            communicator.sendGetClosestNodesRequest(hashedKey, node, function (result) {
                callback(null, result);
            });
        });
    });
    return asyncCallsArray;
};

mergeAsyncCallsResultsIntoOneArray = function (unMergedResults) {
    let mergedResults = [];
    unMergedResults.forEach(result => {
        mergedResults = mergedResults.concat(result);
    });
    return mergedResults;
};

updateShortlistAfterAsyncCalls = function (shortlist, alphaNodes, results) {
    shortlist = addIfUniqueToShortlist(shortlist, alphaNodes, true);
    shortlist = addIfUniqueToShortlist(shortlist, results, false);
    return shortlist;
};

shouldUpdateClosestNode = function (shortlist, currentClosestNode, hashedKey) {
    shortlist = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, shortlist);
    newClosestNode = shortlist[0];

    if (newClosestNode.id !== currentClosestNode.id) {
        console.log("New closest node!");
        return true;
    }

    return false;
};

getNewClosestNode = function (shortlist, currentClosestNode, hashedKey) {
    shortlist = global.BucketManager.sortNodesListByDistanceAscending(hashedKey, shortlist);
    newClosestNode = shortlist[0];
    if (newClosestNode.id !== currentClosestNode.id) {
        return newClosestNode;
    }
    return currentClosestNode;
};

getNextCallAlphaNodesFromShortlist = function (shortlist) {
    nextCallAlphaNodes = [];
    shortlist.forEach(node => {
        if (
            node.isContacted === false &&
            nextCallAlphaNodes.length < constants.alpha
        ) {
            nextCallAlphaNodes.push(node);
        }
    });
    return nextCallAlphaNodes;
};

removeGlobalNodeFromShortlist = function (shortlist) {
    shortlist = shortlist.filter(nd => {
        return nd.id !== global.node.id;
    });
    return shortlist;
};

sendStoreValueToAllNodesInTheShortlist = function (shortlist, hashedKey, value, valueType, callback) {
    let asyncCallsArray = [];
    shortlist.forEach(node => {
        asyncCallsArray.push(function (callback) {
            communicator.sendStoreValue(node, hashedKey, value, valueType, result => {
                callback(null, result);
            });
        });
    });

    async.parallel(asyncCallsArray, (error, result) => {
        if (error) {
            console.log("Error occured: ", error);
        } else {
            console.log("Results in data publisher: " + result);
            callback();
        }
    });
};

selectAlphaClosestNodes = function (closestNodes, hashedKey) {
    closestNodes = global.BucketManager.sortNodesListByDistanceAscending(
        hashedKey,
        closestNodes
    );
    return closestNodes.slice(0, constants.alpha);
};

selectClosestNode = function (nodes, hashedKey) {
    let closestNode = nodes[0];
    for (let i = 1; i < nodes.length; i++) {
        if ((nodes[i] ^ hashedKey) < (closestNode ^ hashedKey)) {
            closestNode = nodes[i];
        }
    }
    return closestNode;
};

removeNodeDuplicates = function (keyFn, array) {
    let mySet = new Set();
    return array.filter(function (x) {
        let key = keyFn(x),
            isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
};

addIfUniqueToShortlist = function (shortlist, nodes, isContacted) {
    nodes.forEach(node => {
        let isInShortList = false;

        shortlist.forEach(item => {
            if (item.id === node.id) {
                isInShortList = true;
            }
        });

        if (!isInShortList) {
            node["isContacted"] = isContacted;
            shortlist.push(node);
        }
    });
    return shortlist;
};

module.exports = DataPublisher;
