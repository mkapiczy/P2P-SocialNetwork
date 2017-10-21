const util = require("./custom_modules/util");
const Node = require("./custom_modules/kademlia/node");
const constants = require("./config/constants");
const BucketManager = require("./custom_modules/kademlia/BucketManager");
const EndpointManager = require("./custom_modules/data/endpointManager");
const communicator = require("./custom_modules/kademlia/kademliaCommunicator");
const WoTManager = require("./custom_modules/wotManager");
const MeasurementManager = require("./custom_modules/data/measurementManager");


class AppInitializer {

    constructor() {
        global.baseNode = new Node(
            constants.BASE_NODE_ID,
            constants.BASE_NODE_IP_ADDR,
            constants.BASE_NODE_PORT
        );

        global.BucketManager = new BucketManager();
        global.EndpointManager = new EndpointManager();
        global.MeasurementManager = new MeasurementManager();
        global.WoTManager = new WoTManager();
    }

    public init(nodeIpAddr, nodePort){
        if (nodePort !== constants.BASE_NODE_PORT) {
            let nodeId = util.createRandomId(constants.B / 8);
            console.log(nodeId + " : " + nodeIpAddr + " : " + nodePort);
            global.node = new Node(nodeId, nodeIpAddr, nodePort);
            global.BucketManager.updateNodeInBuckets(global.baseNode);

            communicator.sendFindNode(global.node.id, global.baseNode, function(result) {
                console.log("Find_node done");
            });
        } else {
            let nodeId = constants.BASE_NODE_ID;
            console.log(nodeId);
            global.node = new Node(nodeId, nodeIpAddr, nodePort);
        }
    }

}

export default new AppInitializer();