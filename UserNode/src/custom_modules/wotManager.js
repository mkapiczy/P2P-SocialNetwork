const communicator = require("./communicator");
const Kademlia = require("../custom_modules/kademlia/kademlia");
const kademlia = new Kademlia();
const StoredValueType = require("../enum/storedValueType");

function WoTManager() {
    this.wotNodes = [];
}

WoTManager.prototype.addWoTDevice = function (endpoint) {
    if (!this.isWoTNodeWithGivenEndpointPresent(endpoint)) {
        let intervalId = setInterval(() => {
            setupNodeCommunication(endpoint)
        }, 5000);
        this.wotNodes.push({endpoint: endpoint, interval: intervalId});
    }
    console.log(this.wotNodes);
};

WoTManager.prototype.removeWoTDevice = function (endpoint) {
    if (this.isWoTNodeWithGivenEndpointPresent(endpoint)) {
        let index = this.wotNodes.indexOf(deviceToRemove);
        if (index > -1) {
            clearInterval(deviceToRemove.interval);
            this.wotNodes.splice(index, 1);
        }
    }
};

WoTManager.prototype.isWoTNodeWithGivenEndpointPresent = function (endpoint) {
    for (let i=0; i < this.wotNodes.length; i++) {
        let node = this.wotNodes[i];
        if (node.endpoint.localeCompare(endpoint) === 0) {
            return true;
        }
    }
    return false;
};

function setupNodeCommunication(endpoint) {
    //Get data from WoT node http://localhost:8000/test/wotData
    communicator.getMeasurement(endpoint, (result) => {
        kademlia.storeValue(endpoint, result, StoredValueType.MEASUREMENT, global.MeasurementManager, () => {
            console.log("Measurement stored and published to k closest nodes!");
        });
    });
}

module.exports = WoTManager;