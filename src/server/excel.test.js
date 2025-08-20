// Mocks must be declared before requiring the module under test
const mockParseDate = { y: 2025, m: 8, d: 20 };

jest.mock('xlsx', () => {
  const utils = {
    encode_col: jest.fn((col) => String.fromCharCode(65 + col)), // 0 -> 'A'
    decode_range: jest.fn(() => ({ s: { c: 0, r: 0 }, e: { c: 2, r: 9 } }))
  };
  return {
    readFile: jest.fn(),
    utils,
    SSF: { parse_date_code: jest.fn(() => mockParseDate) }
  };
});

const mockErrorList = {
  addError: jest.fn(),
  errors: [],
  clearErrors: jest.fn()
};
jest.mock('./error.js', () => mockErrorList);

const xlsx = require('xlsx');
const excel = require('./excel');

describe('excel module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCellCoordinate uses xlsx.utils.encode_col and row', () => {
    const coord = excel.getCellCoordinate(0, 12);
    expect(xlsx.utils.encode_col).toHaveBeenCalledWith(0);
    expect(coord).toBe('A12');
  });

  test('cellExists returns false for undefined and true for object', () => {
    expect(excel.cellExists(undefined)).toBe(false);
    expect(excel.cellExists({ v: 1 })).toBe(true);
  });

  test('readCell returns numbers, strings and dates; reports error for invalid number', () => {
    // Prepare workbook/sheet
    const sheet = {
      'A1': { v: '123' },
      'B1': { v: 'not-a-number' },
      'C1': { v: 44444 },
      '!ref': 'A1:C1'
    };
    const workbook = { SheetNames: ['S'], Sheets: { S: sheet } };
    xlsx.readFile.mockReturnValue(workbook);

    // init worksheet
    excel.initExcelFile('dummy.xlsx', 0);

    // number parse OK
    const num = excel.readCell('A1', 'number');
    expect(num).toBe(123);

    // number parse invalid => undefined & error logged
    const bad = excel.readCell('B1', 'number');
    expect(bad).toBeUndefined();
    expect(mockErrorList.addError).toHaveBeenCalled();

    // string
    const str = excel.readCell('B1', 'string');
    expect(str).toBe('not-a-number');

    // date
    const date = excel.readCell('C1', 'date');
    expect(xlsx.SSF.parse_date_code).toHaveBeenCalledWith(44444);
    expect(date).toBe(mockParseDate);
  });

  test('getColCount decodes !ref and returns column count', () => {
    // make decode_range return e.c = 4, s.c = 0 => count 5
    xlsx.utils.decode_range.mockReturnValueOnce({ s: { c: 0, r: 0 }, e: { c: 4, r: 9 } });

    const sheet = { '!ref': 'A1:E10' };
    const workbook = { SheetNames: ['S'], Sheets: { S: sheet } };
    xlsx.readFile.mockReturnValue(workbook);
    excel.initExcelFile('dummy.xlsx', 0);

    const cols = excel.getColCount();
    expect(cols).toBe(5);
  });

  test('getNumberOfLastDataRow finds last numeric personal number starting at ROW_OF_FIRST_PERSONALNUMMER', () => {
    // Prepare sheet: A5=100, A6=200, A7 undefined, rest undefined
    const sheet = {
      'A5': { v: '100' },
      'A6': { v: '200' },
      '!ref': 'A1:A10'
    };
    const workbook = { SheetNames: ['S'], Sheets: { S: sheet } };
    xlsx.readFile.mockReturnValue(workbook);
    excel.initExcelFile('dummy.xlsx', 0);

    const last = excel.getNumberOfLastDataRow();
    // Rows 5 and 6 contain numbers, next rows empty -> last valid is 6
    expect(last).toBe(6);
  });

  test('readPersonalnummer returns number, undefined for empty and logs error for non-numeric', () => {
    const sheet = {
      'A5': { v: '555' },
      'A6': { v: '' },        // treated as empty
      'A7': { v: 'abc' },     // non-numeric
      '!ref': 'A1:A10'
    };
    const workbook = { SheetNames: ['S'], Sheets: { S: sheet } };
    xlsx.readFile.mockReturnValue(workbook);
    excel.initExcelFile('dummy.xlsx', 0);

    const pn5 = excel.readPersonalnummer(5);
    expect(pn5).toBe(555);

    const pn6 = excel.readPersonalnummer(6);
    expect(pn6).toBeUndefined();

    const pn7 = excel.readPersonalnummer(7);
    expect(pn7).toBeUndefined();
    expect(mockErrorList.addError).toHaveBeenCalled();
  });
});