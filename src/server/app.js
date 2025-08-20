// Node-Core
const path = require('path');

// Third-party
const express = require('express');
const multer = require('multer');
const config = require('../config');

// Local
const ErrorList = require('./error');
const fileHandler = require('./utils/fileHandler');
const logs = require('./utils/logs');
const transformer = require('./transformer');

// Constants
const UPLOAD_FOLDER = config.UPLOAD_FOLDER;

// App init
const app = express();

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {

        // if folder does not exist, create it
        if (!fileHandler.directoryExists(config.UPLOAD_FOLDER)) {
            fileHandler.writeDirectory(config.UPLOAD_FOLDER);
        }
        cb(null, config.UPLOAD_FOLDER);
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname); // Behalte den Originaldateinamen bei
    }
});

const upload = multer({ storage: storage });

// app.use(express.static(path.join(__dirname, '../client')))
app.use('/static', express.static(config.PUBLIC_FOLDER));

// Routen
app.post("/upload", upload.single('upload'), (req, res) => {

    try {
        logs.logServerRouteUpload('filename', req.file.filename);

        // log ip address of client
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        logs.logAttribute('ip address', ip);

        // start timer
        const start = new Date().getTime();
        const targetFilename = transformer.transformToCSV(path.join(UPLOAD_FOLDER, req.file.filename));
        // end timer
        const end = new Date().getTime();
        const time = end - start;
        const txtFileName = targetFilename.replace('upload', 'download');

        res.json({
            statusCode: 200,
            fileName: txtFileName,
            uploadedFileName: req.file.filename,
            downloadFileName: fileHandler.TARGET_FILENAME,
            errorList: ErrorList.errors,
            calculationTimeInMs: time
        });

        ErrorList.clearErrors();
    } catch (error) {
        // Logge den Fehler für das Debugging
        console.error('Fehler bei der Dateiverarbeitung:', error);

        // Sende eine informative Fehlermeldung zurück
        res.status(500).json({
            error: 'Die Datei konnte nicht verarbeitet werden.',
            details: error.message
        });
    }
});

// TODO: make it get request
app.post('/download', function (req, res) {
    const file = req.query.fileName;
    res.download(file);
    res.on('finish', () => { fileHandler.deleteDirectoryOfFile(path.dirname(file)); });
});

module.exports = app;
