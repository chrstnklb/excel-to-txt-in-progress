
const path = require('path');
require('dotenv').config(); // lädt .env, falls vorhanden

module.exports = {

    // Server-Port
    PORT: process.env.PORT || 3000,

    // Vies-Ordner
    VIEWS_FOLDER: path.join(__dirname, '..', 'views'),
    PUBLIC_FOLDER: path.join(__dirname, '..', 'public'),

    // Upload-Folder (ENV > Default)
    UPLOAD_FOLDER: process.env.UPLOAD_FOLDER || path.join(__dirname, 'exchange', 'upload'),

    // Version
    APP_VERSION: process.env.APP_VERSION || '2025.08.20',
    APP_NAME: process.env.APP_NAME || 'relog',
};