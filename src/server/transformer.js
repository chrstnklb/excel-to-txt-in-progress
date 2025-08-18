const excel = require('./excel.js');
const felder = require('./felder.js');
const fileHandler = require('./utils/fileHandler.js');
const Metric = require('./utils/metric.js');

const FIXED_COLUMNS = 2;
const KALENDARIUM_FIXED_COLUMNS = 3;
const LOHNART_ROW = 3;
const DATA_START_ROW = 5;
const COLUMN_COUNT = 12;
const ANZ_TAGE_COLUMN = 9;
const ANZ_STD_COLUMN = 10;
const BETRAG_COLUMN = 11;

let metric = undefined;

function transformToCSV(excelFile) {
    // if (hasSeveralSheets(excelFile) === true) {
    //     return transformKalendariumToTxt(excelFile);
    // } else {
    return transformLohnabrechnungToTxt(excelFile);
    // }
}

function transformLohnabrechnungToTxt(excelFile) {
    console.log(`Verarbeite Lohnabrechnung: ${excelFile}`);

    metric = new Metric();

    // read excel file and get last data row as well as mandantennummer and abrechnungszeitraum
    let workSheet = excel.initExcelFile(excelFile, sheetNumber = 0);
    let lastDataRow = excel.getNumberOfLastDataRow();
    let mandantennummer = felder.readFirmennummer(); // 00
    let abrechnungszeitraum = felder.readAbrechnungsZeitraum(); // 06

    // felder.readPersonalnummer(cellCoordinate = 'A4'); // 01
    
    // generate lines, deduplicate and convert to string
    let alleZeilen = identifyLinesFromCells(workSheet, lastDataRow, mandantennummer, abrechnungszeitraum);
    let uniqueZeilen = deduplicateLines(alleZeilen);
    let fileData = linesToString(uniqueZeilen);
    
    // clean up
    fileHandler.deleteUploadedFiles();

    // write metric
    metric.setRowCount(lastDataRow - DATA_START_ROW);
    metric.writeMetric();

    // write to file
    return fileHandler.writeTxtFile(fileData);
}

function identifyLinesFromCells(workSheet, lastDataRow, mandantennummer, abrechnungszeitraum) {
    let alleZeilen = "";
    
    for (let row = DATA_START_ROW; row <= lastDataRow; row++) {

        let personalnummer = felder.readPersonalnummer(cellCoordinate = ('A' + row)); // 01
        let colCount = excel.getColCount();
        metric.setColCount(colCount);

        for (let col = FIXED_COLUMNS; col < colCount; col++) {
            // Wenn Zelle nicht leer ist
            if (excel.cellExists(workSheet[excel.getCellCoordinate(col, row)])) {
                // Wenn Lohnart Zelle nicht leer ist
                // if (workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)] !== undefined) {
                if (lohnArtIsInvalid(workSheet, col, LOHNART_ROW + 1)) {
                    let headerCellContent = workSheet[excel.getCellCoordinate(col, LOHNART_ROW + 1)].v;
                    let feld = replaceDots(excel.readCell(excel.getCellCoordinate(col, row), 'number'));
                    feld = checkForZero(feld);
                    alleZeilen += createOneLine(
                        mandantennummer,
                        personalnummer,
                        lohnart = felder.readLohnart(headerCellContent),
                        kostenstelle = '',
                        kostentraeger = '',
                        abrechnungstag = '',
                        abrechnungszeitraum,
                        lohnsatz = '',
                        prozentsatz = '',
                        anzahlTage = felder.setAnzahlTage(headerCellContent, feld),
                        anzahlStunden = felder.setAnzahlStunden(headerCellContent, feld),
                        betrag = felder.setBetrag(headerCellContent, feld)
                    );
                }
            }
        }
    }
    return alleZeilen;
}

function linesToString(lines) {
    let fileData = '';
    for (let i = 0; i < lines.length; i++) {
        let zeilen = lines[i].split(';');
        fileData += createOneLine(
            zeilen[0], zeilen[1], zeilen[2], zeilen[3], zeilen[4], zeilen[5],
            zeilen[6], zeilen[7], zeilen[8], zeilen[9], zeilen[10], zeilen[11]
        );
    }
    return fileData;
}


function convertLinesStringToArray(lines) {
    return lines.split('\n');
}

/**
 * find duplicated lines, except for the last 4 columns
 */
function deduplicateLines(alleZeilen) {

    let zeilen = convertLinesStringToArray(alleZeilen);
    zeilen.pop(); // remove last empty line

    let uniqueLines = [];

    for (let i = 0; i < zeilen.length; i++) {

        let felder = zeilen[i].split(';');
        let hasSameKostentraeger = true;

        for (let j = i + 1; j < zeilen.length; j++) {

            let potentialduplicatedColumns = zeilen[j].split(';');

            hasSameKostentraeger = isSameKostentraeger(felder, potentialduplicatedColumns);

            if (hasSameKostentraeger) {

                // Wenn Kostentraeger gleich sind, dann summiere die Werte
                felder[ANZ_TAGE_COLUMN] = sumUp(felder, potentialduplicatedColumns, 3);
                felder[ANZ_STD_COLUMN] = sumUp(felder, potentialduplicatedColumns, 2);
                felder[BETRAG_COLUMN] = sumUp(felder, potentialduplicatedColumns, 1);

                let mergedLine = felder.join(';');
                uniqueLines.push(mergedLine); // add the merged line

                zeilen.splice(j, 1); // remove the duplicate line
                zeilen.splice(j - 1, 1); // remove the original line
            }
        }

        // End of loop, if no duplicate Kostenstelle found
        if (!hasSameKostentraeger || i === zeilen.length - 1) {
            uniqueLines.push(zeilen[i]);
        }

    }
    return uniqueLines;
}

function sumUp(columns, potentialduplicatedColumns, endDistance) {
    let firstValue = parseFloat(columns[columns.length - endDistance].replace(',', '.')) || 0;
    let secondValue = parseFloat(potentialduplicatedColumns[potentialduplicatedColumns.length - endDistance].replace(',', '.')) || 0;

    let result = (firstValue + secondValue).toFixed(2).toString().replace('.', ',');
    return result;
}

function isSameKostentraeger(columns, potentialduplicatedColumns) {
    for (let k = 0; k < 4; k++) {
        if (columns[k] !== potentialduplicatedColumns[k]) {
            return false;
        }
    }
    return true;
}

function checkForZero(feld) {
    if (feld === "0,00") {
        return "";
    }
    return feld;
}

function lohnArtIsInvalid(workSheet, col, row) {
    let cell = workSheet[excel.getCellCoordinate(col, row)];
    // console.log("cell:" + JSON.stringify(cell));

    if (!excel.cellExists(cell)) {
        return false;
    }

    if (cell.v === undefined) {
        return false;
    }

    if (
        !cell.v.includes('KOSTENST')
        && !cell.v.includes('LSATZ')
        && !cell.v.includes('ANZSTD')
        && !cell.v.includes('KOSTENTR')
        && !cell.v.includes('PSATZ')
        && !cell.v.includes('BETRAG')
        && !cell.v.includes('Abrechnungstag')
        && !cell.v.includes('ANZTAGE')
    ) {
        console.log("ups" + cell.v);
        return false;
    }

    return true;

}

function replaceDots(feld) {
    try { feld = feld.toFixed(2).toString().replace('.', ','); }
    catch (error) { console.log(error); }
    return feld;
}

function createOneLine(
    mandantennummer, personalnummer, lohnart,

    kostenstelle, kostentraeger, abrechnungstag,
    abrechnungszeitraum, lohnsatz, prozentsatz,

    anzahlTage, anzahlStunden, betrag
) {
    return `${mandantennummer};` + `${personalnummer};` + `${lohnart};` +

        `${kostenstelle};` + `${kostentraeger};` + `${abrechnungstag};` +
        `${abrechnungszeitraum};` + `${lohnsatz};` + `${prozentsatz};` +

        `${anzahlTage};` + `${anzahlStunden};` + `${betrag}` + '\n'
}

exports.transformToCSV = transformToCSV;
exports.timestamp = this.timestamp;