
const path = require('path');
require('dotenv').config(); // lädt .env, falls vorhanden

module.exports = {
    // Server-Port
    PORT: process.env.PORT || 3000,

    // Upload-Folder (ENV > Default)
    UPLOAD_FOLDER: process.env.UPLOAD_FOLDER
        || path.join(__dirname, 'exchange', 'upload'),
};