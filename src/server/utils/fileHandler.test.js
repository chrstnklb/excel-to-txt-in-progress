const path = require('path');

// Mocks must be defined before requiring the module under test
jest.mock('../../config.js', () => ({
    DOWNLOAD_FOLDER: 'download_folder',
    UPLOAD_FOLDER: 'upload_folder',
    TARGET_FILENAME: 'Imp_lbw.txt'
}));

jest.mock('./time.js', () => ({
    getActualTimeStampYYYYMMDDhhmmss: jest.fn(() => '20250820T000000')
}));

const mockLogs = {
    logCreatedFile: jest.fn(),
    logDeletedFile: jest.fn()
};
jest.mock('./logs.js', () => mockLogs);

const mockFs = {
    writeFile: jest.fn((filePath, data, cb) => cb(null)),
    mkdirSync: jest.fn(),
    unlink: jest.fn((filename, cb) => cb(null)),
    rm: jest.fn((p, opts, cb) => cb(null)),
    readdir: jest.fn((folder, cb) => cb(null, ['a.txt', 'b.txt'])),
    existsSync: jest.fn((p) => p === 'exists'),
    promises: {}
};
jest.mock('fs', () => mockFs);

// now require the module under test
const fileHandler = require('./fileHandler');

describe('fileHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('writeToFile creates directory, writes file and returns filepath', () => {
        const folder = 'myfolder';
        const filename = 'file.txt';
        const data = 'hello';
        const expectedPath = path.join(folder, filename);

        const result = fileHandler.writeToFile(folder, filename, data);

        expect(mockFs.mkdirSync).toHaveBeenCalledWith(folder, { recursive: true });
        expect(mockFs.writeFile).toHaveBeenCalledWith(expectedPath, data, expect.any(Function));
        expect(result).toBe(expectedPath);
        expect(mockLogs.logCreatedFile).toHaveBeenCalledWith(expectedPath);
    });

    test('writeDirectory calls mkdirSync', () => {
        fileHandler.writeDirectory('some/dir');
        expect(mockFs.mkdirSync).toHaveBeenCalledWith('some/dir', { recursive: true });
    });

    test('deleteFile calls fs.unlink and logs deletion', async () => {
        await fileHandler.deleteFile('to-delete.txt');
        expect(mockFs.unlink).toHaveBeenCalledWith('to-delete.txt', expect.any(Function));
        expect(mockLogs.logDeletedFile).toHaveBeenCalledWith('to-delete.txt');
    });

    test('deleteDirectoryOfFile calls fs.rm', async () => {
        await fileHandler.deleteDirectoryOfFile('some/dir');
        expect(mockFs.rm).toHaveBeenCalledWith('some/dir', { recursive: true }, expect.any(Function));
    });

    test('deleteFiles reads directory and calls deleteFile for each file', async () => {
        // spy/replace the module's deleteFile so we can assert calls
        const spy = jest.spyOn(fileHandler, 'deleteFile').mockImplementation(() => Promise.resolve());
        await fileHandler.deleteFiles('upload_folder');
        expect(mockFs.readdir).toHaveBeenCalledWith('upload_folder', expect.any(Function));
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(path.join('upload_folder', 'a.txt'));
        expect(spy).toHaveBeenCalledWith(path.join('upload_folder', 'b.txt'));
        spy.mockRestore();
    });

    test('directoryExists returns true for existing path and false otherwise', () => {
        expect(fileHandler.directoryExists('exists')).toBe(true);
        expect(fileHandler.directoryExists('nope')).toBe(false);
    });

    test('writeTxtFile builds download path and delegates to writeToFile', () => {
        const spy = jest.spyOn(fileHandler, 'writeToFile').mockReturnValue('/fake/path/Imp_lbw.txt');
        const result = fileHandler.writeTxtFile('content');
        const expectedFolder = path.join('download_folder', '20250820T000000');
        expect(spy).toHaveBeenCalledWith(expectedFolder, 'Imp_lbw.txt', 'content');
        expect(result).toBe('/fake/path/Imp_lbw.txt');
        spy.mockRestore();
    });

    test('deleteUploadedFiles delegates to deleteFiles with configured UPLOAD_FOLDER', () => {
        const spy = jest.spyOn(fileHandler, 'deleteFiles').mockResolvedValue();
        fileHandler.deleteUploadedFiles();
        expect(spy).toHaveBeenCalledWith('upload_folder');
        spy.mockRestore();
    });
});