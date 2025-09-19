import { environment } from "../../../environments/environment"; 
const url = environment.apiUrl;

export const publicApi = {
    addEntry: url +'scholarship/addEntryList',
    dublicateEntry: url +'scholarship/duplicateEntry',
    uploadFilesWithForm: url +'scholarship/uploadFilesWithForm',
    uploadAttachFilesWithForm: url + 'scholarship/uploadAttachFilesWithForm',
    checkstatus: url + 'scholarship/viewDetailsByTOID',
    generateCertificate: url + 'scholarship/generateCertificate',
    deleteFile: url + 'scholarship/deleteFile',
    downloadFile: url + 'scholarship/downloadFile',
    customLogin: url + 'login/chkuser',
    listRole: url + 'scholarship/listRoles',
    checkPendingRequest: url + 'scholarship/checkPendingRequest',
    updatePendingRequest: url + 'scholarship/updatePendingRequest',
    showAcceptedList: url + 'scholarship/showAcceptedList'
}
