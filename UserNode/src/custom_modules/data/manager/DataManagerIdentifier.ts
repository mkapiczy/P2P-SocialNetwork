import {ValueTypeEnum} from "../../enum/ValueTypeEnum";


class DataManagerIdentifier {

    getDataManagerBasedOnDataType(type: ValueTypeEnum): DataManagerInterface {
        if(type === ValueTypeEnum.ACKNOWLEDGEMENT_REQUEST){
            return global.AcknowledgmentRequestManager;
        }
    }
}

export default new DataManagerIdentifier();

