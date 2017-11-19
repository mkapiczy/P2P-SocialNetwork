import {KeyDTO} from "../entity/dto/KeyDTO";
import {UserDataDTO} from "../entity/dto/UserDataDTO";

export class AcknowledgmentRerquestMsg {
    id: String;
    key: KeyDTO;
    userData: UserDataDTO;

    isValid: boolean; //Flag indicating whether message has been removed from network (soft delete)

    constructor(id: String, key: KeyDTO, userData: UserDataDTO) {
        this.id = id;
        this.key = key;
        this.userData = userData;
        this.isValid = true;
    }

    setId(id: String) {
        this.id = id;
    }
}