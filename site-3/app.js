console.clear();
require('dotenv-safe').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const tokenAndGuildVerifyMiddleware = require('./src/middlewares/token-and-guild-verify-middleware');
// const userVerifyMiddleware = require('./src/middlewares/user-verify-middleware');
// const guildAndWhitelistVerifyMiddleware = require('./src/middlewares/guild-and-whitelist-verify-middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', require('./src/routes/index'));

app.get('/auth/callback', require('./src/routes/auth/callback'));

app.get('/auth/logout', require('./src/routes/auth/logout'));

// app.get('/checkout/item', require('./src/routes/checkout/item'));

// app.get('/error', require('./src/routes/error'));

app.use(tokenAndGuildVerifyMiddleware);

// // app.get('/auth/get', require('./src/routes/auth/get'));

// app.use(userVerifyMiddleware);

// app.get('/auth/verify-whitelist', require('./src/routes/auth/verify-whitelist'));

// app.use(guildAndWhitelistVerifyMiddleware);

app.get('/site', require('./src/routes/site'));

// catch 404 and forward to error handler
app.use(require('./src/middlewares/error-404-middleware'));

// error handler
app.use(require('./src/middlewares/error-500-middleware'));

module.exports = app;
