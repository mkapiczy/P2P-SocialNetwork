import {Request, Response, Router} from 'express';
import {DataEncrypter} from "../custom_modules/crypto/DataEncrypter";
import {DataSigner} from "../custom_modules/crypto/DataSigner";
import {KeyGenerator} from "../custom_modules/crypto/KeyGenerator";
import {KeyFileStore} from "../custom_modules/crypto/KeyFileStore";
import {KeyDTO} from "../custom_modules/data/entity/dto/KeyDTO";
import {KeyType} from "../custom_modules/enum/KeyTypeEnum";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";
import {UserDataDTO} from "../custom_modules/data/entity/dto/UserDataDTO";
import AcknowldgementService from "../service/AcknowledgementService"
import RegistrationService from "../service/RegistrationService";


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
        // we get the form data from the view
        let username = request.body.username;
        let approver = request.body.approver;
        console.log("Username received: " + request.body.username);
        console.log("Username received: " + request.body.approver);
        // generate public private key

        let id = '55';
        KeyGenerator.generatePublicPrivateKeyPairAndWriteToFile(id);
        KeyGenerator.generatePublicPrivateKeyPairAndWriteToFile('1');

        let privateKey = KeyFileStore.readPrivateKeyFromStore(id);
        let publicKey = KeyFileStore.readPublicKeyFromStore(id);


        let testMessage = "THIS IS A TEST MESSAGE";
        console.log("Before Encyption: " + testMessage);

        let encMessage = DataEncrypter.encryptWithPublicKey(testMessage, publicKey);
        console.log("Encrypted message: " + encMessage);

        let decMessage = DataEncrypter.decryptWithPrivateKey(encMessage, privateKey);
        console.log("Decrypt message: " + decMessage);

        let signature = DataSigner.signDataWithPrivateKey(testMessage, privateKey);
        console.log("Is signature valid for wrong message: " + DataSigner.isSignatureValid(testMessage + "h", signature, publicKey));

        console.log("Is signature valid for right message: " + DataSigner.isSignatureValid(testMessage, signature, publicKey));

        let key = new KeyDTO(publicKey.toString(), KeyType.GLOBAL);
        let userData = new UserDataDTO(username);
        let acknowledgmentRerquestMsg = new AcknowledgmentRerquestMsg(key, userData);

        AcknowldgementService.publiskAcknowledgementRequestMsgIntoTheNetwork(approver, acknowledgmentRerquestMsg, () => {
            response.send('Ack published to the network!');
        });
    };

}

export default new RegistrationController().router;

