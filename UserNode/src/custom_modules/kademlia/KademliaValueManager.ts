const Kademlia = require("./kademlia");
const kademlia = new Kademlia();

class KademliaValueManager {
    public getAvailableKey(key, keyIteration, valueType, callback) {
        let callKey = key + keyIteration.toString();
        console.log("Call key " + callKey + " check");
        kademlia.findValue(callKey, valueType, (value) => {
            if (value) {
                this.getAvailableKey(key, ++keyIteration, valueType, callback);
            } else {
                callback(callKey);
            }
        });
    }

    public getAllValuesForRelatedKeys(key, valueType, callback) {
        let messages = [];
        this.getAllValuesForRelatedKeysAccum(key, messages, valueType, (messages) => {
            callback(messages)
        });
    }

    private getAllValuesForRelatedKeysAccum(key, messagesAccumulator, valueType, callback) {
        let itaration = messagesAccumulator.length;
        let callKey = key + itaration.toString();
        kademlia.findValue(callKey, valueType, (value) => {
            if (value) {
                messagesAccumulator.push(value);
                this.getAllValuesForRelatedKeysAccum(key, messagesAccumulator, valueType, callback);
            } else {
                callback(messagesAccumulator);
            }
        });
    }
}

export default new KademliaValueManager();
