import { generate } from "rxjs"

const url = 'https://uatjiffy.timesgroup.com/timescape/api/';
// public static apitime = require('../../assets/configdata/appconfig.json').apiBaseUrl;
//   "apiBaseUrl": "https://wsqa.timesgroup.com",

export const publicApi = {
    addEntry: url +'scholarship/addEntryList',
    dublicateEntry: url +'scholarship/duplicateEntry',
    uploadFilesWithForm: url +'scholarship/uploadFilesWithForm',
    uploadAttachFilesWithForm: url + 'scholarship/uploadAttachFilesWithForm',
    checkstatus: url + 'scholarship/viewDetailsByTOID',
    generateCertificate: url + 'scholarship/generateCertificate',
    deleteFile: url + 'scholarship/deleteFile',
    downloadFile: url + 'scholarship/downloadFile',
    customLogin: url + 'login/chkuser'
}
