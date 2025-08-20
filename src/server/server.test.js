const request = require('supertest');
const app = require('./app'); // Angenommen, deine Express-App ist in app.js
const path = require('path');
const fs = require('fs');
const config = require('../config');

let server;

beforeAll(async () => {
  // Startet den Server
  await new Promise(resolve => {
    server = app.listen(3000, () => {
      resolve();
    });
  });
});

afterAll(async () => {
  // Schließt den Server
  await new Promise(resolve => {
    server.close(() => {
      resolve();
    });
  });
});

// Testsuite für die API-Endpunkte
describe('API Endpoints', () => {
  // Test für den POST /upload Endpunkt
  test('POST /upload sollte eine Excel-Datei hochladen und die korrekte Antwort zurückgeben', async () => {
    // Pfad zur Testdatei festlegen
    const testFilePath = path.join(config.TESTDATA_FOLDER, 'post-upload-correct.xlsx');

    // Sicherstellen, dass die Datei existiert
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Testdatei nicht gefunden: ${testFilePath}`);
    }

    const res = await request(app)
      .post('/upload')
      .attach('upload', testFilePath); // Hängt die Datei an die Anfrage an

    // Prüfe den Statuscode und fahre dann fort
    expect(res.statusCode).toBe(200);

    // Erwartungen an die Antwort
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('fileName');
    expect(res.body).toHaveProperty('uploadedFileName', 'post-upload-correct.xlsx');
    expect(res.body).toHaveProperty('downloadFileName');
    expect(res.body.errorList).toEqual([]);
    expect(res.body).toHaveProperty('calculationTimeInMs');

    // Optional: Die erzeugte Datei nach dem Test löschen
    if (res.body.fileName) {
      // Extrahiere den Download-Ordner aus der Konfiguration
      const downloadedFilePath = path.join(config.DOWNLOAD_FOLDER, res.body.fileName);
      if (fs.existsSync(downloadedFilePath)) {
        fs.unlinkSync(downloadedFilePath);
      }
    }
  });

  it('sollte eine GET-Anfrage an / zurückgeben', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});