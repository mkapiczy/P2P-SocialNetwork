import {ValueTypeEnum} from "../../enum/ValueTypeEnum";


class DataManagerIdentifier {

    getDataManagerBasedOnDataType(type: ValueTypeEnum): DataManagerInterface {
        if (type === ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST) {
            return global.AcknowledgmentRequestManager;
        } else if (type == ValueTypeEnum.CHAT_MSG) {
            return global.ChatMsgManager;
        }
    }
}

export default new DataManagerIdentifier();

