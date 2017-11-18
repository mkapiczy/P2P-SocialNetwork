import ChatMsgManager from "./custom_modules/data/manager/ChatMsgManager";
import AcknowledgmentRequestManager from "./custom_modules/data/manager/AcknowledgmentRequestManager";
import SignedKeyManager from "./custom_modules/data/manager/SignedKeyManager";

const util = require("./custom_modules/util");
const Node = require("./custom_modules/kademlia/node");
const constants = require("./config/constants");
const BucketManager = require("./custom_modules/kademlia/BucketManager");
const communicator = require("./custom_modules/kademlia/kademliaCommunicator");


class AppInitializer {

    constructor() {
        global.baseNode = new Node(
            constants.BASE_NODE_ID,
            constants.BASE_NODE_ID,
            constants.BASE_NODE_IP_ADDR,
            constants.BASE_NODE_PORT
        );

        global.BucketManager = new BucketManager();
        global.AcknowledgmentRequestManager = AcknowledgmentRequestManager;
        global.SignedKeyManager = SignedKeyManager;
        global.ChatMsgManager = ChatMsgManager;
    }

    public init(nodeIpAddr, nodePort) {
        if (nodePort !== constants.BASE_NODE_PORT) {
            console.log(nodeIpAddr + " : " + nodePort);
            global.node = new Node(null, null, nodeIpAddr, nodePort);
        } else {
            let nodeId = constants.BASE_NODE_ID;
            console.log(nodeId);
            global.node = new Node(nodeId, nodeId, nodeIpAddr, nodePort);
        }
    }

}

export default new AppInitializer();