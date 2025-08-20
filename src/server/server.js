// Third-party
const chalk = require('chalk');
const figlet = require('figlet');

// Local
const config = require('../config');
const app = require('./app.js');

// Template Engine einstellen
app.set('view engine', 'ejs');
app.set('views', config.VIEWS_FOLDER); // Ordner für .ejs-Dateien

app.get('/', (_req, res) => {
  res.render('index', { version: config.APP_VERSION });
});

app.listen(config.PORT, () => {

  console.clear();
  figlet.text('RELOG', { font: 'ANSI Shadow' }, (err, ascii) => {
    const title = err ? 'RELOG' : ascii;

    console.log(chalk.cyan(title));
    console.log(chalk.yellow(`Name: \t\t ${config.APP_NAME}`) + chalk.green.italic(` - by SoSoQic`));
    console.log(chalk.yellow(`Version: \t v${config.APP_VERSION}`));
    console.log(chalk.green(`Server: \t http://localhost:${config.PORT}`));
    console.log(chalk.blue(`Uploads: \t ${config.UPLOAD_FOLDER}`));
    console.log(chalk.magenta(`Views: \t\t ${config.VIEWS_FOLDER}`));
    console.log(chalk.magenta(`Static: \t ${config.PUBLIC_FOLDER}`));
  });
});

