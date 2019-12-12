const { google } = require('googleapis');
const { googleCredentials, sheetId } = require('./config.json');
const sheets = google.sheets('v4');

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets'
];

async function getAuthToken() {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        credentials: googleCredentials
    });

    return auth.getClient();
}

async function getSheetData() {
    const token = await getAuthToken();

    return sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        auth: token,
        fields: 'sheets.properties.sheetId,sheets.data.rowData.values.userEnteredValue'
    });
}

async function updateSheet(requests) {
    const token = await getAuthToken();

    return sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        auth: token,
        resource: {
            requests
        }
    });
}

module.exports.getAuthToken = getAuthToken;
module.exports.getSheetData = getSheetData;
module.exports.updateSheet = updateSheet;