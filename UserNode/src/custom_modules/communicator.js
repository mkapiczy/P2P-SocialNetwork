const request = require("request");

const NodeState = require("../enum/nodeStateEnum");

exports.notifyClosestNode = function (closestNode, endpoint, callBack) {
    let requestOptions = {
        method: "POST",
        uri: closestNode.ipAddr + ":" + closestNode.port + "/api/notification",
        body: {
            nodeId: global.node.id,
            nodeIP: global.node.ipAddr,
            nodePort: global.node.port,
            endpoint: endpoint
        },
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            callBack(NodeState.NOT_ALIVE);
        } else {
            console.log(response.body);
                console.log("Response from notification ");
                callBack(NodeState.ALIVE);
        }
    });
};

exports.getMeasurement = function (endpoint, callBack) {
    let requestOptions = {
        method: "GET",
        uri: endpoint, 
        json: true
    };

    request(requestOptions, function (error, response) {
        if (error) {
            console.log(error);
            callBack(NodeState.NOT_ALIVE);
        } else {
            console.log(response.body);
            console.log("Response from notification ");
            callBack(response.body);
        }
    });
};
