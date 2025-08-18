const request = require('supertest');
const app = require('../server/app'); // Angenommen, deine Express-App ist in app.js
const path = require('path');
const fs = require('fs');

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
    const testFilePath = path.join(__dirname, 'testdata', 'post-upload-correct.xlsx');

    // Sicherstellen, dass die Datei existiert
    if (!fs.existsSync(testFilePath)) {
      throw new Error(`Testdatei nicht gefunden: ${testFilePath}`);
    }

    const res = await request(app)
      .post('/upload')
      .attach('upload', testFilePath); // Hängt die Datei an die Anfrage an

    // Gib die Antwort aus, um den Fehler zu sehen
    console.log('API-Antwort:', res.body);
    
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
      const downloadedFilePath = path.join(__dirname, 'download', path.basename(res.body.fileName));
      if (fs.existsSync(downloadedFilePath)) {
        fs.unlinkSync(downloadedFilePath);
      }
    }
  });

  // Dein alter GET-Test
  test('GET / sollte eine erfolgreiche Antwort zurückgeben', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    // expect(res.text).toBe('Server is running');
  });

    it('sollte eine GET-Anfrage an / zurückgeben', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});