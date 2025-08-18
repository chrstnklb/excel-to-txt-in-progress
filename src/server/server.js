const path = require('path');

const app = require('./app.js');

const transformer = require('./transformer.js');
const fileHandler = require('./utils/fileHandler.js');
const logs = require('./utils/logs.js');

const UPLOAD_FOLDER = '../exchange/upload/';


// Korrigierte Version:
const PORT = process.env.PORT || 3000; // Heroku setzt process.env.PORT

const url = `http://localhost:${PORT}`

let clientIp = undefined;

const { getType } = require('mime');

app.listen(PORT, () => {
    logs.logAttribute('listening at', url);
    console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = {
    clientIp: clientIp
}

// Exportiere die App, aber starte den Server nicht
module.exports = app;