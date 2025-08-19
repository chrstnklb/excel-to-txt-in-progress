const excel = require('./excel.js');
const ErrorList = require('./error.js');

const KOSTEN_ST = 'KOSTENST';
const L_SATZ = 'LSATZ';
const ANZ_STD = 'ANZSTD';
const KOSTEN_TR = 'KOSTENTR';
const P_SATZ = 'PSATZ';
const BETRAG = 'BETRAG';
const ABRECHNUNGSTAG = 'Abrechnungstag';
const ANZ_TAGE = 'ANZTAGE';

module.exports = {

    // Nr.:             0
    // Feldbezeichnung: FINUM
    // Verwendung:      Firmennummer
    // TYP:             NUMBER
    // MAX_LENGTH:      7
    // Muss-Feld:       Ja
    // Excel-Zelle:     B2
    readFirmennummer: function (cellCoordinate = 'B2') {
        let firmennummer = excel.readCell(cellCoordinate, 'number');
        if (firmennummer === undefined) {
            ErrorList.addError(
                `Die Mandantennummer wurde erwartet. ` +
                `Doch die Zelle '${cellCoordinate}' ist leer!`);
        }
        return firmennummer;
    },

    // Nr.:             1
    // Feldbezeichnung: PERSNR
    // Verwendung:      Personalnummer  
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Ja
    // Excel-Zelle:     A5
    readPersonalnummer: function (cellCoordinate) {
        let personalnummer = excel.readCell(cellCoordinate, 'string');
        // Remove - from Personalnummer if it exists and also linebreaks
        if (personalnummer !== undefined) {

            personalnummer = personalnummer.replace(/(\r\n|\n|\r)/gm, "");
            personalnummer = personalnummer.replace('-', '');
            /*}
            if (personalnummer === undefined) {
                ErrorList.addError(
                    `Die Personalnummer wurde erwartet. ` +
                    `Doch die Zelle '${cellCoordinate}' ist leer!`);
            } else
            
            if (cellCoordinate === "A4" && personalnummer !== "Personalnummer") {
                ErrorList.addError(
                    `In Zell 'A4' wurde 'Personalnummer' erwartet. ` +
                    `Doch die Zelle beinhaltet ${personalnummer}!`);
            } else if (String(personalnummer).toLowerCase() === "neu") {
                ErrorList.addError(
                    `Die Zelle '${cellCoordinate}' beinhaltet ${personalnummer}!`);
            } else {*/
            personalnummer = personalnummer.padStart(6, '0');
        }
        return personalnummer;
    },

    // Nr.:             2
    // Feldbezeichnung: LOHNART
    // Verwendung:      Lohnart
    // TYP:             NUMBER
    // MAX_LENGTH:      4
    // Muss-Feld:       Ja
    // Excel-Zelle:     C4
    readLohnart: function (cellContent) {
        // when given this "[LA400,0] [ANZTAGE] i want only 400
        // \d+ -> match one or more digits
        // [0] -> get the first match
        return cellContent.match(/\d+/)[0];
    },

    // Nr.:             3
    // Feldbezeichnung: KOSTENST
    // Verwendung:      Kostenstelle
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             4
    // Feldbezeichnung: KOSTENTR
    // Verwendung:      Kostenträger
    // TYP:             NUMBER
    // MAX_LENGTH:      8
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             5
    // Feldbezeichnung: AbrechnungsTag
    // Verwendung:      Abrechnungstag
    // TYP:             NUMBER
    // MAX_LENGTH:      2
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             6
    // Feldbezeichnung: AbrechnungsZeitraum
    // Verwendung:      Abrechnungszeitraum
    // TYP:             DATE
    // MAX_LENGTH:      tt.mm.jjjj oder ttmmjjjj
    // Muss-Feld:       Ja
    // Excel-Zelle:     B3
    readAbrechnungsZeitraum: function (cellCoordinate = 'B3') {
        let abrechnungsZeitraum = excel.readCell(cellCoordinate, 'date');

        if (abrechnungsZeitraum === undefined) {
            ErrorList.addError(
                `Der Abrechnungszeitraum wird im Format DD.MM.JJJJ erwartet. ` +
                `Doch die Zelle '${cellCoordinate}' ist leer!`);
        } else {
            const day = abrechnungsZeitraum.d.toString().padStart(2, '0');
            const month = abrechnungsZeitraum.m.toString().padStart(2, '0');
            const year = abrechnungsZeitraum.y.toString();
            abrechnungsZeitraum = day + '.' + month + '.' + year;

            if (!/^01\.\d{2}\.20\d{2}$/.test(abrechnungsZeitraum)) {
                console.log(abrechnungsZeitraum);

                ErrorList.addError(
                    `Der Abrechnungszeitraum wird im Format 01.MM.20JJ erwartet. ` +
                    `Doch die Zelle '${cellCoordinate}' beinhaltet ${JSON.stringify(excel.readCell(cellCoordinate, 'string'))}!`
                );
            }
        }
        return abrechnungsZeitraum;
    },

    // Nr.:             7
    // Feldbezeichnung: LSATZ
    // Verwendung:      Lohnsatz
    // TYP:             NUMBER
    // MAX_LENGTH:      8(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             8
    // Feldbezeichnung: PSATZ
    // Verwendung:      Prozentsatz
    // TYP:             NUMBER
    // MAX_LENGTH:      6(3)
    // Muss-Feld:       Nein

    // Nr.:             9
    // Feldbezeichnung: ANZTAGE
    // Verwendung:      Anzahl Tage
    // TYP:             NUMBER
    // MAX_LENGTH:      4(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             10
    // Feldbezeichnung: ANZSTUNDEN
    // Verwendung:      Anzahl Stunden
    // TYP:             NUMBER
    // MAX_LENGTH:      6(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    // Nr.:             11
    // Feldbezeichnung: BETRAG
    // Verwendung:      Betrag
    // TYP:             NUMBER
    // MAX_LENGTH:      8(2)
    // Muss-Feld:       Nein
    // Excel-Zelle:     ???

    setAnzahlStunden: function (headerCellContent, feld) {
        return headerCellContent.includes(KOSTEN_ST) // 03
            || headerCellContent.includes(L_SATZ) // 07
            || headerCellContent.includes(ANZ_STD) // 10
            ? feld
            : "";
    },

    setBetrag: function (headerCellContent, feld) {
        return headerCellContent.includes(KOSTEN_TR) // 04
            || headerCellContent.includes(P_SATZ) // 08
            || headerCellContent.includes(BETRAG) // 11
            ? feld
            : "";
    },

    setAnzahlTage: function (headerCellContent, feld) {
        return headerCellContent.includes(ABRECHNUNGSTAG) // 05
            || headerCellContent.includes(ANZ_TAGE) // 09
            ? feld
            : "";
    }
}