const constants = require("../../config/constants");
const util = require("../util");

function EndpointManager() {
  this.dataStorage = new Map();
}

EndpointManager.prototype.storeValue = function(key, value) {
  this.dataStorage.set(key, value);
};

EndpointManager.prototype.storeValueWithKeyHashing = function(key, value) {
  hashedKey = util.createHashFromKey(key, constants.B / 8);
  this.dataStorage.set(hashedKey, value);
};

EndpointManager.prototype.findValueByNonHashedKey = function(key) {
    hashedKey = util.createHashFromKey(key, constants.B / 8);
    return this.dataStorage.get(Number(hashedKey));
};

EndpointManager.prototype.findValueByHashedKey = function(hashedKey) {
  return this.dataStorage.get(Number(hashedKey));
};

module.exports = EndpointManager;
