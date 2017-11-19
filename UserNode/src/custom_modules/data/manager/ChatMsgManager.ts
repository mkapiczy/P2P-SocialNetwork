import {ChatMsg} from "../message/ChatMsg";

const constants = require("../../../config/constants");
const util = require("../../util");

class ChatMsgManager implements DataManagerInterface {
    dataStorage: Map<String, ChatMsg> = new Map();

    storeValue(key: String, message: ChatMsg): void {
        this.dataStorage.set(key, message);
    }

    storeValueWithKeyHashing(key: String, value: ChatMsg): void {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        this.storeValue(hashedKey, value);
    }

    findValueByNonHashedKey(key: String): ChatMsg {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        console.log("Hashed key: " + hashedKey);
        console.log("Hashed key 1-20: " + util.createHashFromKey("1-20", constants.B / 8));
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String): ChatMsg {
        return this.dataStorage.get(key);
    }

    findAllValuesForRelatedKeys(parentKey: String): Array<ChatMsg> {
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

export default new ChatMsgManager();

