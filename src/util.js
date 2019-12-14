const moment = require('moment-timezone');

const REP_NAMES = [
    'Amon',
    'Sarah',
    'Zlatan',
    'Sean',
    'Preston'
];

function getRandomName() {
    return REP_NAMES[Math.floor(Math.random() * REP_NAMES.length)];
}

function momentToExcelDate(moment) {
    const returnDateTime = 25569.0 + ((moment.valueOf() + ((moment._offset || 0) * 60 * 1000)) / (1000 * 60 * 60 * 24));

    return +(returnDateTime.toString().substr(0,20));
}

function getCellValue(cell) {
    return cell.userEnteredValue && cell.userEnteredValue.stringValue;
}

function lookupColumn(sheet, row, headerName) {
    if (!sheet._columns) sheet._columns = {};

    if (typeof sheet._columns[headerName] !== 'undefined') return sheet._columns[headerName];

    if (row.values) {
        const columnIdx = row.values.findIndex(cell => getCellValue(cell) === headerName);

        if (columnIdx !== -1) {
            sheet._columns[headerName] = columnIdx;

            return columnIdx;
        }
    }

    return -1;
}

function createUpdateCellRequest(sheetId, rowIndex, columnIndex, data, numberType = 'NUMBER') {
    const isNumber = typeof data === 'number';

    return {
        updateCells: {
            rows: {
                values: {
                    userEnteredValue: {
                        stringValue: !isNumber ? data : undefined,
                        numberValue: isNumber ? data : undefined
                    },
                    userEnteredFormat: isNumber ? {
                        numberFormat: {
                            type: numberType
                        }
                    } : undefined
                }
            },
            fields: '*',
            start: {
                sheetId,
                rowIndex,
                columnIndex
            }
        }
    };
}

function getNow() {
    return momentToExcelDate(moment().tz('America/New_York'));
}

module.exports.getRandomName = getRandomName;
module.exports.momentToExcelDate = momentToExcelDate;
module.exports.getCellValue = getCellValue;
module.exports.lookupColumn = lookupColumn;
module.exports.createUpdateCellRequest = createUpdateCellRequest;
module.exports.getNow = getNow;
