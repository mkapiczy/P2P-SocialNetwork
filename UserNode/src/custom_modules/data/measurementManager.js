const util = require("../util");
const constants = require("../../config/constants");

function MeasurementManager() {
    this.dataStorage = new Map();
}

MeasurementManager.prototype.storeValue = function (hashedKey, measurement) {
    let measurementsList = this.dataStorage.get(hashedKey);
    if (measurementsList) {
        measurementsList.push(measurement);
    } else {
        measurementsList = [];
        measurementsList.push(measurement);
        this.dataStorage.set(hashedKey, measurementsList);
    }
};

MeasurementManager.prototype.storeValueWithKeyHashing = function (endpoint, measurement) {
    hashedKey = util.createHashFromKey(endpoint, constants.B / 8);
    let measurementsList = this.dataStorage.get(hashedKey);
    if (measurementsList) {
        measurementsList.push(measurement);
    } else {
        measurementsList = [];
        measurementsList.push(measurement);
        this.dataStorage.set(hashedKey, measurementsList);
    }
};

MeasurementManager.prototype.findValueByNonHashedKey = function (key) {
    hashedKey = util.createHashFromKey(key, constants.B / 8);
    return this.dataStorage.get(Number(hashedKey));
};

MeasurementManager.prototype.findValueByHashedKey = function (hashedKey) {
    return this.dataStorage.get(Number(hashedKey));
};

MeasurementManager.prototype.printData = function () {
    this.dataStorage.forEach((value, key) => {
        console.log(value);
    })
};

module.exports = MeasurementManager;