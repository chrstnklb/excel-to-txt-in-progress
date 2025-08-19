const xlsx = require('xlsx');
const path = require('path');
const ErrorList = require('./error.js');
const { UPLOAD_FOLDER } = require('../config.js');

const HEADER_ROW = 3;
const ROW_OF_FIRST_PERSONALNUMMER = 5;
const COLUMN_OF_PERSONALNUMMER = 'A';

let workBook = undefined;
let workSheet = undefined;

// Helfer: akzeptiert 123 | -123 | 123.45 | -123.45 | 123,45 | -123,45
function isNumericLike(value) {
    if (value === null || value === undefined) return false;
    const s = String(value).trim();
    return /^-?[0-9]+([,.][0-9]+)?$/.test(s);
}

function normalizeNumber(value) {
    // Vorbedingung: isNumericLike(value) === true
    return Number(String(value).trim().replace(',', '.'));
}

function isEmptyOrZero(cell) {
    if (!cell || cell.v === undefined || String(cell.v).trim() === '') return true;
    // 0 explizit als „leer“ interpretieren
    if (Number(String(cell.v).replace(',', '.')) === 0) return true;
    return false;
}

module.exports = {

    readPersonalnummer: function (row) {
        if (!workSheet) {
            throw new Error('Worksheet ist nicht initialisiert. Ruf zuerst initExcelFile(...) auf.');
        }
        const cellRef = COLUMN_OF_PERSONALNUMMER + row;
        const cell = workSheet[cellRef];

        if (!cell || cell.v === undefined || String(cell.v).trim() === '') {
            // Leerzeilen sind erlaubt -> undefined zurückgeben
            return undefined;
        }
        if (!isNumericLike(cell.v)) {
            ErrorList.addError(`Die Personalnummer in der Zelle ${cellRef} ist inkorrekt (nicht numerisch)`);
            return undefined;
        }
        return normalizeNumber(cell.v); // immer Number
    },

    hasSeveralSheets: function (excelFile) {
        const workBook = this.getWorkBook(excelFile);
        return workBook.SheetNames.length > 1;
    },

    initExcelFile: function (excelFile, sheetNumber = 0) {
        const workBook = this.getWorkBook(excelFile);
        let actualFirstSheetName = workBook.SheetNames[sheetNumber];
        workSheet = workBook.Sheets[actualFirstSheetName];
        return workSheet;
    },

    getWorkBook: function (excelFile) {
        console.log(`Lese Excel-Datei: ${excelFile}`);
        console.log(`Pfad: ${path.join(UPLOAD_FOLDER, excelFile)}`);
        console.log(`Upload-Ordner: ${UPLOAD_FOLDER}`);


        workBook = xlsx.readFile(excelFile);
        return workBook;
    },

    getNumberOfSheets: function () {
        if (!workBook) {
            throw new Error("Workbook ist nicht initialisiert. Ruf zuerst initExcelFile(...) oder getWorkBook(...) auf.");
        }
        return workBook.SheetNames.length;
    },

    readCell: (cellCoordinate, targetFormat) => {
        let result = undefined;
        if (workSheet.hasOwnProperty(cellCoordinate)) {
            const data = workSheet[cellCoordinate].v;

            if (targetFormat === 'number') {
                const s = String(data).trim();
                // Erlaube: 123 | -123 | 123.45 | -123.45 | 123,45 | -123,45
                if (/^-?[0-9]+([,.][0-9]+)?$/.test(s)) {
                    result = normalizeNumber(s); // 0 bleibt 0
                } else {
                    ErrorList.addError(
                        `Die Zelle '${cellCoordinate}' beinhaltet '${data}', ` +
                        `welches keine (gültige) Zahl ist!`
                    );
                }
            }

            if (targetFormat === 'string') result = data.toString();
            if (targetFormat === 'date') result = xlsx.SSF.parse_date_code(data);
        }
        return result;
    },

    getColCount: function () {
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const colCount = range.e.c - range.s.c + 1
        return colCount;
    },

    getNumberOfLastDataRow: function () {

        if (!workSheet) {
            throw new Error('Worksheet ist nicht initialisiert. Ruf zuerst initExcelFile(...) auf.');
        }

        // Suche die letzte Zeile mit einer Personalnummer
        // Die Personalnummern beginnen in der Zeile ROW_OF_FIRST_PERSONALNUMMER
        // und in der Spalte COLUMN_OF_PERSONALNUMMER (A)
        // Die letzte Zeile wird ermittelt, indem alle Zellen in der Spalte COLUMN_OF_PERSONALNUMMER
        // ab ROW_OF_FIRST_PERSONALNUMMER durchlaufen werden,
        // bis eine leere Zelle gefunden wird.
        const range = xlsx.utils.decode_range(workSheet['!ref']);
        const lastPossibleRow = range.e.r + 1; // range ist 0-basiert, Excel 1-basiert
        let lastValidRow = ROW_OF_FIRST_PERSONALNUMMER - 1;

        for (let row = ROW_OF_FIRST_PERSONALNUMMER; row <= lastPossibleRow; row++) {
            const cellRef = COLUMN_OF_PERSONALNUMMER + row;
            const cell = workSheet[cellRef];

            if (isEmptyOrZero(cell)) {
                // keine Stunden eingetragen oder 0 => überspringen
                continue;
            }

            // bisherige Logik beibehalten: Nicht-Zahlen melden
            if (!isNumericLike(cell.v)) {
                ErrorList.addError(`Die Personalnummer in der Zelle ${cellRef} ist inkorrekt (nicht numerisch)`);
                continue;
            }

            // gültige (numerische) Personalnummer -> als letzte gültige merken
            lastValidRow = row;
        }

        return lastValidRow;
    },

    getCellCoordinate: function (col, row) {
        return xlsx.utils.encode_col(col) + row;
    },

    cellExists: function (cell) {
        return cell !== undefined
    }

}