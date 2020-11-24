require('dotenv-safe').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
// const cookieParser = require('cookie-parser');
// const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use('/assets', express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(helmet());
// app.use(cookieParser());

app.get('/', (req, res) => {
    if (process.env.MAINTENANCE == 1) {
        return res.render('maintenance');
    }

    return res.render('index', {
        apiPath: process.env.API_PATH,
    });
});

app.get('/robots.txt', (req, res) => {
    return res.send(`User-Agent: *
Disallow:`);
});

app.use((req, res, next) => {
    return res.render('error-404', {
        apiPath: process.env.API_PATH,
    });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
