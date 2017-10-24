class Measurement {
    value: object;
    timestamp: Date;

    constructor(value: object, timestamp: Date) {
        this.value = value;
        this.timestamp = timestamp;
    }
}

module.exports = Measurement;