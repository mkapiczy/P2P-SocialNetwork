import ChatMsgManager from "./custom_modules/data/manager/ChatMsgManager";
import AcknowledgmentRequestManager from "./custom_modules/data/manager/AcknowledgmentRequestManager";
import SignedKeyManager from "./custom_modules/data/manager/SignedKeyManager";
import {KeyGenerator} from "./custom_modules/crypto/KeyGenerator";

const Node = require("./custom_modules/kademlia/node");
const constants = require("./config/constants");
const BucketManager = require("./custom_modules/kademlia/BucketManager");
import {KeyFileStore} from "./custom_modules/crypto/KeyFileStore";
import {KeyDTO} from "./custom_modules/data/entity/dto/KeyDTO";
import {KeyType} from "./custom_modules/enum/KeyTypeEnum";
import SignedKeyService from "./service/SignedKeyService";
const util = require("./custom_modules/util");


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
            const userName = constants.BASE_NODE_ID;
            const userId = util.createHashFromKey(userName, constants.B / 8);

            global.node = new Node(global.baseNode.username, userId, nodeIpAddr, nodePort);

            KeyGenerator.generatePublicPrivateKeyPairAndWriteToFile(userId);
            global.publicKey = KeyFileStore.readPublicKeyFromStore(userId);
            global.privateKey = KeyFileStore.readPrivateKeyFromStore(userId);

            let keyDto = new KeyDTO(global.publicKey.toString(),KeyType.GLOBAL);
            let signedKey = SignedKeyService.generateSignedKey(userName, keyDto);

            SignedKeyService.publishSignedKeyIntoTheNetwork(userName, signedKey, () => {
                console.log("Signed Key for user " + userName + " published into the network");

            });
        }
    }

}

export default new AppInitializer();