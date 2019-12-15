const moment = require('moment-timezone');
const { register } = require('./util');
const sheet = require('../../sheet');
const { getRandomName, momentToExcelDate, getCellValue, createUpdateCellRequest, lookupColumn } = require('../../util');

register('purchased', async (msg, rawDate) => {
    const username = msg.author.username + '#' + msg.author.discriminator;

    let date = moment(rawDate, 'MM/DD/YYYY');
    if (!date.isValid()) {
        return msg.reply('The date you provided is not valid. The expected format is MM/DD/YYYY.');
    }

    const data = await sheet.getSheetData();

    const requests = [];

    data.data.sheets.some(sheet => {
        return sheet.data.some(data => {
            return data.rowData.some((row, rowIdx) => {
                if (!row.values) return;

                const discordColumn = lookupColumn(sheet, row, 'Discord');
                const datePurchasedColumn = lookupColumn(sheet, row, 'Date Purchased');

                if (discordColumn !== -1 && datePurchasedColumn !== -1) {
                    // find discord user
                    if (getCellValue(row.values[discordColumn]) === username) {
                        requests.push(createUpdateCellRequest(sheet.properties.sheetId, rowIdx, datePurchasedColumn, momentToExcelDate(date), 'DATE'));

                        return true;
                    }
                }
            });
        });
    });

    if (!requests.length) {
        return msg.reply('Could not find your Discord username in the sheet. Please add your information via the Google Form if it does not already exist: https://forms.gle/pJpGAbD7mVDG2RVs6');
    }

    await sheet.updateSheet(requests);

    msg.reply(`\n\nYour Date Purchased has been set to **${date.format('dddd, MMMM Do, YYYY')}**.\n\nRunning on coffee,\n${getRandomName()}`);
});
