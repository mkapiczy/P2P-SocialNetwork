import {Router, Request, Response} from 'express';
import {DataEncrypter} from "../custom_modules/crypto/DataEncrypter";
import {DataSigner} from "../custom_modules/crypto/DataSigner";
import {KeyGenerator} from "../custom_modules/crypto/KeyGenerator";
import {KeyFileStore} from "../custom_modules/crypto/KeyFileStore";
import {Signature} from "../custom_modules/data/entity/Signature";
import {Key} from "../custom_modules/data/entity/Key";
import {KeyType} from "../custom_modules/enum/KeyTypeEnum";
import {AcknowledgmentRerquestMsg} from "../custom_modules/data/message/AcknowledgementRequestMsg";

const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const util = require("../custom_modules/util");
import {ValueTypeEnum} from "../custom_modules/enum/ValueTypeEnum"
const constants = require("../config/constants");


class RegistrationController {
    router: Router = Router();

    constructor() {
        this.router.get("/", this.get);
        this.router.post("/", this.post);
    }

    get(request, response) {
        let username = request.query.username;
        console.log("Registration get received for username: " + username);
        kademlia.findValue(username, (value, nodeId) => {
            console.log("value: " + value + "  nodeId: " + nodeId);
            response.send("value: " + value.key.value + "  nodeId: " + nodeId);
        })

    };

    post(request, response) {
        // we get the form data from the view
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
        let key = new Key(publicKey, KeyType.GLOBAL);
        let signatureToPublish = new Signature(signature, approver, "base64");
        let acknowledgmentRerquestMsg = new AcknowledgmentRerquestMsg(key, signatureToPublish);

        kademlia.storeValue(approver, acknowledgmentRerquestMsg, ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST, global.AcknowledgmentRequestManager, (closestNodes) => {

        });


        // find the user with provided id to acknowledge the data

        // ask him for his public key

        // sign our data with our private key - our signature

        // sign our signature + public ket with his public key

        // We send the data to him, and await response

        // He gets it he decryptsthe data with his private key.

        // So now he has our public key and our signed data.

        // Decrypts our signature with our public key

        // Confirms the data by signing it with his private key.

        // Return the confirmed data to us

        // We publish it to the network. Providing in meta-data our public key and the id of acknowledging node.

        console.log("Registration post received");
        response.send('Data from server');
    };

}

export default new RegistrationController().router;

