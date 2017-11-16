import {SignedKeyDTO} from "../entity/dto/SignedKeyDTO";
const constants = require("../../../config/constants");
const util = require("../../util");

class SignedKeyManager implements DataManagerInterface {
    dataStorage: Map<String, SignedKeyDTO> = new Map();

    storeValue(key: String, value: SignedKeyDTO): void {
        this.dataStorage.set(key, value);
    }

    storeValueWithKeyHashing(key: String, value: SignedKeyDTO): void {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.dataStorage.set(hashedKey, value);
    }

    findValueByNonHashedKey(key: String): SignedKeyDTO {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String): SignedKeyDTO {
        return this.dataStorage.get(key);
    }
}

export default new SignedKeyManager();

