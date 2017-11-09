import {AcknowledgmentRerquestMsg} from "../message/AcknowledgementRequestMsg";

const constants = require("../../../config/constants");
const util = require("../../util");

class AcknowledgmentRequestManager implements DataManagerInterface {
    dataStorage: Map<String, AcknowledgmentRerquestMsg> = new Map();

    storeValue(key: String, message: AcknowledgmentRerquestMsg): void {
        this.dataStorage.set(key, message);
    }

    storeValueWithKeyHashing(key: String, value: AcknowledgmentRerquestMsg): void {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.storeValue(hashedKey, value);
    }

    findValueByNonHashedKey(key: String): AcknowledgmentRerquestMsg {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String): AcknowledgmentRerquestMsg {
        return this.dataStorage.get(key);
    }

    findAllValuesForRelatedKeys(parentKey: String,): Array<AcknowledgmentRerquestMsg> {
        let resultMessages = [];
        let msgIterator = 0;
        let msg;
        do {
            let key = parentKey + msgIterator.toString();
            console.log("Local " + key);
            msg = this.findValueByNonHashedKey(key);
            if (msg) {
                resultMessages.push(msg);
            }
            msgIterator++;
        } while (msg);

        return resultMessages;
    }
}

export default new

AcknowledgmentRequestManager();

