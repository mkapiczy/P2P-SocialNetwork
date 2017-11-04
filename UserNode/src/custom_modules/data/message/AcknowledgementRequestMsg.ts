import {KeyDTO} from "../entity/dto/KeyDTO";
import {UserDataDTO} from "../entity/dto/UserDataDTO";

export class AcknowledgmentRerquestMsg {
    key: KeyDTO;
    userData: UserDataDTO;

    constructor(key: KeyDTO, userData: UserDataDTO) {
        this.key = key;
        this.userData = userData;
    }
}