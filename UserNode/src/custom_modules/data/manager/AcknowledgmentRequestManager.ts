import {AcknowledgmentRerquestMsg} from "../message/AcknowledgementRequestMsg";
import {isUndefined} from "util";

const constants = require("../../../config/constants");
const util = require("../../util");

class AcknowledgmentRequestManager implements DataManagerInterface {
    dataStorage: Map<String, Array<AcknowledgmentRerquestMsg>> = new Map();

    storeValue(key: String, value: AcknowledgmentRerquestMsg): void {
        let messages = this.dataStorage.get(key);
        if (isUndefined(messages)) {
            messages = [];
        }
        messages.push(value);
        this.dataStorage.set(key, messages);
    }

    storeValueWithKeyHashing(key: String, value: AcknowledgmentRerquestMsg): void {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.storeValue(hashedKey, value);
    }

    findValueByNonHashedKey(key: String): Array<AcknowledgmentRerquestMsg> {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String): Array<AcknowledgmentRerquestMsg> {
        return this.dataStorage.get(key);
    }
}

export default new

AcknowledgmentRequestManager();

