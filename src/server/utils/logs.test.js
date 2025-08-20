const logs = require('./logs');
const consoleSpy = jest.spyOn(console, 'log');

describe.skip('Logs module', () => {

    let logSpy;
    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockClear();
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    test('logServerRouteUpload logs a message', () => {
        logs.logServerRouteUpload('test', 'value');
        expect(consoleSpy).toHaveBeenCalledWith('server:route:upload:test:\n\tvalue');
    });

    test('logServerRoute logs a message', () => {
        logs.logServerRoute('test');
        expect(consoleSpy).toHaveBeenCalledWith('server:route:test');
    });

    test('logServer logs a message', () => {
        logs.logServer('test');
        expect(consoleSpy).toHaveBeenCalledWith('server:test');
    });

    test('logAttribute logs a message', () => {
        logs.logAttribute('test', 'value');
        expect(consoleSpy).toHaveBeenCalledWith('server:attribute:test:\n\tvalue');
    });


    test('logCreatedFile logs the created file path', () => {
        const filePath = '/tmp/test-created.txt';
        logs.logCreatedFile(filePath);
        expect(console.log).toHaveBeenCalled();
        const msg = console.log.mock.calls[0][0];
        expect(msg).toEqual(expect.stringContaining(filePath));
    });

    test('logDeletedFile logs the deleted file path', () => {
        const filePath = '/tmp/test-deleted.txt';
        logs.logDeletedFile(filePath);
        expect(console.log).toHaveBeenCalled();
        const msg = console.log.mock.calls[0][0];
        expect(msg).toEqual(expect.stringContaining(filePath));
    });

    test('logServerRouteUpload logs route attribute and filename', () => {
        logs.logServerRouteUpload('filename', 'uploaded.xlsx');
        expect(console.log).toHaveBeenCalled();
        const msg = console.log.mock.calls[0][0];
        expect(msg).toEqual(expect.stringContaining('filename'));
        expect(msg).toEqual(expect.stringContaining('uploaded.xlsx'));
    });

    test('logAttribute logs attribute name and value', () => {
        logs.logAttribute('ip address', '127.0.0.1');
        expect(console.log).toHaveBeenCalled();
        const msg = console.log.mock.calls[0][0];
        expect(msg).toEqual(expect.stringContaining('ip address'));
        expect(msg).toEqual(expect.stringContaining('127.0.0.1'));
    });
});