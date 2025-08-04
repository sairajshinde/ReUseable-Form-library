import { generate } from "rxjs"

const url = 'https://uatjiffy.timesgroup.com/timescape/api/'

export const publicApi = {
    addEntry: url +'scholarship/addEntryList',
    dublicateEntry: url +'scholarship/duplicateEntry',
    uploadFilesWithForm: url +'scholarship/uploadFilesWithForm',
    checkstatus: url + 'scholarship/viewDetailsByTOID',
    generateCertificate: url + 'scholarship/generateCertificate',
    deleteFile: url + 'scholarship/deleteFile',
    downloadFile: url + 'scholarship/downloadFile'
}
