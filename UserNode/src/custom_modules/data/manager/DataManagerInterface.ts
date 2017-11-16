interface DataManagerInterface {
    dataStorage: Map<String, any>;

    storeValue(key: String, value: object);

    storeValueWithKeyHashing(key: String, value: object);

    findValueByNonHashedKey(key: String);

    findValueByHashedKey(key: String);
}