const app = require('./app.js');

const config = require('../config'); 

app.listen(config.PORT, () => {
  console.log(`Server läuft auf Port ${config.PORT}`);
  console.log(`Uploads landen in: ${config.UPLOAD_FOLDER}`);
});

// Exportiere die App, aber starte den Server nicht
module.exports = app;