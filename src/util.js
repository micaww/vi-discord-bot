const repNames = [
    'Amon',
    'Sarah',
    'Zlatan',
    'Sean',
    'Preston'
];

function getRandomName() {
    return repNames[Math.floor(Math.random() * repNames.length)];
}

function momentToExcelDate(moment) {
    const returnDateTime = 25569.0 + ((moment.valueOf() + (moment._offset * 60 * 1000)) / (1000 * 60 * 60 * 24));

    return returnDateTime.toString().substr(0,20);
}

module.exports.getRandomName = getRandomName;
module.exports.momentToExcelDate = momentToExcelDate;