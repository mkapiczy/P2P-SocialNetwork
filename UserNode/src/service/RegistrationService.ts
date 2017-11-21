import {Request, Response, Router} from 'express';
import SignedKeyService from "./SignedKeyService";

class RegistrationService {

    constructor() {
    }

    public isRegistered(username: String, callback: (result: Boolean) => void) {
        SignedKeyService.getUsersSignedKey(username, (signedKey) => {
            if (signedKey) {
                console.log("User is acknowledged: " + signedKey);
                callback(true)
            } else {
                callback(false);
            }
        });
    }


}


export default new RegistrationService();

