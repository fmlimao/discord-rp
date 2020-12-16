console.clear();
require('dotenv-safe').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./src/middlewares/check-login'));

app.get('/', require('./src/routes/index'));
app.get('/auth/login', require('./src/routes/auth/login'));
app.get('/auth/logout', require('./src/routes/auth/logout'));
app.get('/auth/callback', require('./src/routes/auth/callback'));

app.use(require('./src/middlewares/validate-login'));

app.use('/app', expressLayouts);
app.set('layout', 'app/layout');

app.use(require('./src/middlewares/manage-roles'));

app.use('/app', require('./src/routes/app'));

// app.use(require('./src/middlewares/error-404'));
app.use(require('./src/middlewares/error-500'));

app.listen(process.env.APP_PORT, () => {
    console.log(`=> Servidor rodando na porta ${process.env.APP_PORT}`);
});
