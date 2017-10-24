const util = require("../util");
const constants = require("../../config/constants");

class MeasurementManager implements DataManagerInterface {
    dataStorage: Map<String, any> = new Map();

    storeValue(key: String, value: Measurement) {
        let measurementsList = this.dataStorage.get(key);
        if (measurementsList) {
            measurementsList.push(value);
        } else {
            measurementsList = [];
            measurementsList.push(value);
            this.dataStorage.set(key, measurementsList);
        }
    }

    storeValueWithKeyHashing(key: String, value: Measurement) {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        let measurementsList = this.dataStorage.get(hashedKey);
        if (measurementsList) {
            measurementsList.push(value);
        } else {
            measurementsList = [];
            measurementsList.push(value);
            this.dataStorage.set(hashedKey, measurementsList);
        }
    }

    findValueByNonHashedKey(key: String) {
        let hashedKey = util.createHashFromKey(key, constants.B / 8);
        return this.dataStorage.get(hashedKey);
    }

    findValueByHashedKey(key: String) {
        return this.dataStorage.get(key);
    }
}

export default new MeasurementManager();
