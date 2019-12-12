const moment = require('moment-timezone');
const { register } = require('./util');
const sheet = require('../../sheet');
const { getRandomName, momentToExcelDate } = require('../../util');

register('lastupdated', async (msg, list) => {
    const usage = "Usage: !lastupdated <list of names>\n\nUsed to bulk update a list of comma-separated users' **Last Updated** date on the spreadsheet.";

    if (!list) {
        return msg.reply(usage);
    }

    const usernames = [...new Set(list.split(','))];
    const updatedUsernames = [];

    if (!usernames.length) {
        return msg.reply(usage);
    }

    msg.reply('Processing... This usually takes 4-8 seconds, but may fluctuate due to holiday demand.');

    const now = momentToExcelDate(moment().tz('America/New_York'));

    const data = await sheet.getSheetData();

    const requests = [];

    const addRequest = (sheetId, rowIndex, columnIndex) => {
        requests.push({
            updateCells: {
                rows: {
                    values: {
                        userEnteredValue: {
                            numberValue: now
                        },
                        userEnteredFormat: {
                            numberFormat: {
                                type: 'DATE_TIME'
                            }
                        }
                    }
                },
                fields: '*',
                start: {
                    sheetId,
                    rowIndex,
                    columnIndex
                }
            }
        });
    };

    const getCellValue = (cell) => cell.userEnteredValue && cell.userEnteredValue.stringValue;

    data.data.sheets.forEach(sheet => {
        let usernameColumn = -1;
        let lastUpdatedColumn = -1;

        sheet.data.forEach(data => {
            data.rowData.forEach((row, rowIdx) => {
                if (!row.values) return;

                if (usernameColumn === -1) {
                    // discover username column
                    usernameColumn = row.values.findIndex(cell => getCellValue(cell) === 'Username');
                }

                if (lastUpdatedColumn === -1) {
                    // discover last updated column
                    lastUpdatedColumn = row.values.findIndex(cell => getCellValue(cell) === 'Last Updated');
                }

                if (usernameColumn !== -1 && lastUpdatedColumn !== -1) {
                    const value = getCellValue(row.values[usernameColumn]);

                    if (usernames.includes(value)) {
                        // username found in spreadsheet. update the last updated column
                        addRequest(sheet.properties.sheetId, rowIdx, lastUpdatedColumn, now);
                        updatedUsernames.push(value);
                    }
                }
            });
        });
    });

    const notFoundUsers = usernames.filter(username => !updatedUsernames.includes(username));
    if (notFoundUsers.length) {
        return msg.reply(`Some users were not found in the sheet, so none have been updated: ${notFoundUsers.join(', ')}`);
    }

    await sheet.updateSheet(requests);

    msg.reply(`\n\nThe users specified have been updated in the Valve Index Shipping spreadsheet.\n\nRunning on coffee,\n${getRandomName()}`);
});