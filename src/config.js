
const path = require('path');
require('dotenv').config(); // lädt .env, falls vorhanden

module.exports = {

    // Server-Port
    PORT: process.env.PORT || 3000,

    // Views-Ordner
    VIEWS_FOLDER: process.env.VIEWS_FOLDER || path.join(__dirname, '..', 'views'),
    PUBLIC_FOLDER: process.env.PUBLIC_FOLDER || path.join(__dirname, '..', 'public'),

    // Upload-Folder (ENV > Default)
    UPLOAD_FOLDER: process.env.UPLOAD_FOLDER || path.join(__dirname, 'exchange', 'upload'),
    DOWNLOAD_FOLDER: process.env.DOWNLOAD_FOLDER || path.join(__dirname, 'exchange', 'download'),
    METRIC_FOLDER: process.env.METRIC_FOLDER || path.join(__dirname, 'exchange', 'metric'),

    TESTDATA_FOLDER: process.env.TESTDATA_FOLDER || path.join(__dirname, 'server', 'testdata'),

    // Target Filename
    TARGET_FILENAME: process.env.TARGET_FILENAME || 'Imp_lbw.txt',

    // Version
    APP_VERSION: process.env.APP_VERSION || '2025.08.25',
    APP_NAME: process.env.APP_NAME || 'relog',
};