import {AcknowledgmentRerquestMsg} from "../message/AcknowledgementRequestMsg";

const constants = require("../../../config/constants");
const util = require("../../util");

class AcknowledgmentRequestManager implements DataManagerInterface {
    dataStorage: Map<String, AcknowledgmentRerquestMsg> = new Map();

    storeValue(key: String, value: AcknowledgmentRerquestMsg): void {
        this.dataStorage.set(key, value);
    }

    storeValueWithKeyHashing(key: String, value: AcknowledgmentRerquestMsg): void {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.dataStorage.set(hashedKey, value);
    }

    findValueByNonHashedKey(key: String): AcknowledgmentRerquestMsg {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String): AcknowledgmentRerquestMsg {
        return this.dataStorage.get(key);
    }
}

export default new AcknowledgmentRequestManager();

