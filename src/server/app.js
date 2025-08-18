const express = require('express');

const app = express();

const multer = require('multer');
const path = require('path');
const fileHandler = require('./utils/fileHandler');
const transformer = require('./transformer');
const logs = require('./utils/logs');
const ErrorList = require('./error');

const UPLOAD_FOLDER = '../exchange/upload/';

// Korrigierte Version:
const PORT = process.env.PORT || 3000; // Heroku setzt process.env.PORT

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // if folder does not exist, create it
        if (!fileHandler.directoryExists(path.join(__dirname, UPLOAD_FOLDER))) {
            fileHandler.writeDirectory(path.join(__dirname, UPLOAD_FOLDER));
        }
        cb(null, path.join(__dirname, UPLOAD_FOLDER));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Behalte den Originaldateinamen bei
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, '../client')))

app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        const type = getType(path);
        if (type === 'application/javascript' || type === 'text/css') {
            res.setHeader('Content-Type', type);
        }
    }
}));

// Deine Routen
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

// Füge weitere Routen hier hinzu...
app.get('/', (req, res) => {
    res.status(200);
    res.send('Server is running');
});

// TODO: make it get request
app.post('/download', function (req, res) {
    const file = req.query.fileName;
    res.download(file);
    res.on('finish', () => { fileHandler.deleteDirectoryOfFile(path.dirname(file)); });
});

module.exports = app;
