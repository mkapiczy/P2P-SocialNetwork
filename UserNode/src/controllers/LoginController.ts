import {Router, Request, Response} from 'express';
import {KeyFileStore} from "../custom_modules/crypto/KeyFileStore";
import RegistrationService from "../service/RegistrationService";
import SignedKeyService from "../service/SignedKeyService";
import {SignedKeyDTO} from "../custom_modules/data/entity/dto/SignedKeyDTO";

const util = require("../custom_modules/util");
const constants = require("../config/constants");

const HttpStatus = require("http-status-codes");

class LoginController {
    router: Router = Router();

    constructor() {
        this.router.post("/", this.login);
    }

    public login(request, response) {
        let username = request.body.username;
        const userId = util.createHashFromKey(username, constants.B / 8);

        global.privateKey = KeyFileStore.readPrivateKeyFromStore(userId);

        if (!global.privateKey) {
            console.log('Private key does not exist for user ' + username + ' id: ' + userId);
            response.status(404).send('Private key does not exist');
            return;
        }

        RegistrationService.isRegistered(userId, (isRegistered) => {
            if (isRegistered) {
                global.publicKey = KeyFileStore.readPublicKeyFromStore(userId);
                if (global.publicKey) {
                    response.status(200).send('All good!');
                    return
                } else {
                    SignedKeyService.getUsersSignedKey(userId, (signedKey: SignedKeyDTO) => {
                        if (signedKey) {
                            global.publicKey = signedKey.key;
                            KeyFileStore.writePublicKeyPemToStore(userId, signedKey.key.value); //Todo not sure if signedKey.key.value is correctly received here
                            response.status(200).send('All good! Public Key found in network');
                        } else {
                            response.status(404).send('Public Key not found in network');
                        }
                    });
                }
            } else {
                response.status(401).send('User is not yet approved');
            }
        });
    }

}

export default new LoginController().router;