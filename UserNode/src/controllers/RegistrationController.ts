import {Request, Response, Router} from 'express';
import {KeyGenerator} from "../custom_modules/crypto/KeyGenerator";
import {KeyFileStore} from "../custom_modules/crypto/KeyFileStore";
import {KeyDTO} from "../custom_modules/data/entity/dto/KeyDTO";
import {KeyType} from "../custom_modules/enum/KeyTypeEnum";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import AcknowldgementService from "../service/AcknowledgementService"
import RegistrationService from "../service/RegistrationService";

const constants = require("../config/constants");
const util = require("../custom_modules/util");
const HttpStatus = require("http-status-codes");
const communicator = require("../custom_modules/kademlia/kademliaCommunicator");

class RegistrationController {
    router: Router = Router();

    constructor() {
        this.router.get("/status", this.checkIfRegistered);
        this.router.post("/", this.post);
    }

    checkIfRegistered(request, response) {
        let username = request.query.username;
        console.log("Is registered check received for username: " + username);
        RegistrationService.isRegistered(username, (result => {
            response.send(result);
        }))
    };

    post(request, response) {
        let username = request.body.username;
        let approver = request.body.approver;

        const userId = util.createHashFromKey(username, constants.B / 8);
        global.node.setId(userId);
        global.node.setUsername(username);
        global.BucketManager.updateNodeInBuckets(global.baseNode);

        communicator.sendFindNode(global.node.id, global.baseNode, function (result) {
            RegistrationService.isRegistered(userId, (isRegistered) => {
                if (isRegistered) {
                    response.status(HttpStatus.FORBIDDEN).send("User with this username already registered in the network!");
                } else {
                    KeyGenerator.generatePublicPrivateKeyPairAndWriteToFile(userId);
                    let publicKey = KeyFileStore.readPublicKeyFromStore(userId);
                    let key = new KeyDTO(publicKey.toString(), KeyType.GLOBAL);
                    let userData = new UserDataDTO(username);
                    AcknowldgementService.publiskAcknowledgementRequestMsgIntoTheNetwork(approver, key, userData, () => {
                        response.status(HttpStatus.OK).json({username: username});
                    });
                }
            });
        });


    };

}

export default new RegistrationController().router;

