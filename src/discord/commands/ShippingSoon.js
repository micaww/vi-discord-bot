const { register } = require('./util');
const sheet = require('../../sheet');
const { getRandomName, getCellValue, createUpdateCellRequest, lookupColumn } = require('../../util');

register('shippingsoon', async (msg) => {
    const username = msg.author.username + '#' + msg.author.discriminator;

    const data = await sheet.getSheetData();

    const requests = [];

    data.data.sheets.some(sheet => {
        return sheet.data.some(data => {
            return data.rowData.some((row, rowIdx) => {
                if (!row.values) return;

                const discordColumn = lookupColumn(sheet, row, 'Discord');
                const statusColumn = lookupColumn(sheet, row, 'Current Shipping Status');
                const dateShippedColumn = lookupColumn(sheet, row, 'Date Shipped');

                if (discordColumn !== -1 && statusColumn !== -1) {
                    // find discord user
                    if (getCellValue(row.values[discordColumn]) === username) {
                        requests.push(createUpdateCellRequest(sheet.properties.sheetId, rowIdx, statusColumn, 'Shipping Soon'));

                        if (dateShippedColumn !== -1) {
                            requests.push(createUpdateCellRequest(sheet.properties.sheetId, rowIdx, dateShippedColumn, ''));
                        }

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

    msg.reply(`\n\nYour current order status has been changed to **Shipping Soon**. Once it ships, use **!shipped** to update your row on the spreadsheet.\n\nRunning on coffee,\n${getRandomName()}`);
});
