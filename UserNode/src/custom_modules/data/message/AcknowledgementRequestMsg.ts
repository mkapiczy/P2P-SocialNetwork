import {KeyDTO} from "../entity/dto/KeyDTO";
import {UserDataDTO} from "../entity/dto/UserDataDTO";

export class AcknowledgmentRerquestMsg {
    id: String;
    key: KeyDTO;
    userData: UserDataDTO;

    constructor(id: String, key: KeyDTO, userData: UserDataDTO) {
        this.id = id;
        this.key = key;
        this.userData = userData;
    }

    setId(id: String) {
        this.id = id;
    }
}