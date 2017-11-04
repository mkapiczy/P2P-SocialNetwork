import {KeyType} from "../../../enum/KeyTypeEnum";

export class KeyDTO {
    value: String;
    type: KeyType;

    constructor(value: String, type: KeyType) {
        this.value = value;
        this.type = type;
    }
}