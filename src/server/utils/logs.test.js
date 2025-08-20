const logs = require('./logs');
const consoleSpy = jest.spyOn(console, 'log');

describe.skip('Logs module', () => {
    beforeEach(() => {
        consoleSpy.mockClear();
    });

    test('logServerRouteUpload logs a message', () => {
        logs.logServerRouteUpload('test', 'value');
        expect(consoleSpy).toHaveBeenCalledWith('server:route:upload:test:\n\tvalue');
    });

    test('logServerRouteDownload logs a message', () => {
        logs.logServerRouteDownload('test', 'value');
        expect(consoleSpy).toHaveBeenCalledWith('server:route:download:test:\n\tvalue');
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
});