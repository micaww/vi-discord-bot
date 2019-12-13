const moment = require('moment-timezone');
const { register } = require('./util');
const sheet = require('../../sheet');
const { getRandomName, getCellValue, createUpdateCellRequest, lookupColumn, momentToExcelDate } = require('../../util');

register('delivered', async (msg, rawDate) => {
    const username = msg.author.username + '#' + msg.author.discriminator;

    let date = moment().tz('America/New_York');

    if (rawDate) {
        date = moment(rawDate, 'MM/DD/YYYY').tz('America/New_York');
        if (!date.isValid()) {
            return msg.reply('The date you provided is not valid. The expected format is MM/DD/YYYY.');
        }
    }

    const data = await sheet.getSheetData();

    const requests = [];

    let error = '';

    data.data.sheets.some(sheet => {
        return sheet.data.some(data => {
            return data.rowData.some((row, rowIdx) => {
                if (!row.values) return;

                const discordColumn = lookupColumn(sheet, row, 'Discord');
                const statusColumn = lookupColumn(sheet, row, 'Current Shipping Status');
                const dateShippedColumn = lookupColumn(sheet, row, 'Date Shipped');
                const dateDeliveredColumn = lookupColumn(sheet, row, 'Date Delivered');

                if (discordColumn !== -1 && statusColumn !== -1 && dateShippedColumn !== -1) {
                    // find discord user
                    if (getCellValue(row.values[discordColumn]) === username) {
                        if (['Shipped', 'Delivered'].includes(getCellValue(row.values[statusColumn])) && row.values[dateShippedColumn].userEnteredValue) {
                            requests.push(createUpdateCellRequest(sheet.properties.sheetId, rowIdx, statusColumn, 'Delivered'));

                            if (dateDeliveredColumn !== -1) {
                                requests.push(createUpdateCellRequest(sheet.properties.sheetId, rowIdx, dateDeliveredColumn, momentToExcelDate(date), 'DATE'));
                            }
                        } else {
                            error = 'Your order must first have the "Shipped" or "Delivered" status and a "Date Shipped" to be marked as "Delivered". Use **!shipped** to change your status to "Shipped".';
                        }

                        return true;
                    }
                }
            });
        });
    });

    if (!requests.length) {
        return msg.reply(error || 'Could not find your Discord username in the sheet. Please add your information via the Google Form if it does not already exist: https://forms.gle/pJpGAbD7mVDG2RVs6');
    }

    await sheet.updateSheet(requests);

    msg.reply(`\n\nYour current order status has been changed to **Delivered**, and the Delivery Date has been set to now. If this is incorrect, use **!delivered MM/DD/YYYY** to update your row.\n\nHave fun with your new Valve Index! :sweat_drops: :sweat_drops:\n\nRunning on coffee,\n${getRandomName()}`);
});
