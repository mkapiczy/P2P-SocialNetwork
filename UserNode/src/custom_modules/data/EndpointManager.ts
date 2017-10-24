const constants = require("../../config/constants");
const util = require("../util");

class EndpointManager implements DataManagerInterface {
    dataStorage: Map<String, any> = new Map();

    storeValue(key: String, value: Object) {
        this.dataStorage.set(key, value);
    }

    storeValueWithKeyHashing(key: String, value: Object) {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.dataStorage.set(hashedKey, value);
    }

    findValueByNonHashedKey(key: String) {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String) {
        return this.dataStorage.get(key);

    }

}

export default new EndpointManager();

