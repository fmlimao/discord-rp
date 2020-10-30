require('dotenv-safe').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use('/assets', express.static(path.join(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
// app.use(helmet());
app.use(cookieParser());

const middlewareIsLogges = (isNotLoggedPath, isLoggedPath) => {
    return (req, res, next) => {
        // logado
        if (req.cookies.login) {
            if (isLoggedPath) return res.redirect(isLoggedPath);
        }

        // deslogado
        if (!req.cookies.login) {
            if (isNotLoggedPath) return res.redirect(isNotLoggedPath);
        }

        return next();
    };
};

// res.cookie('systemLogin', token);
// console.log('req.cookies.systemLogin', req.cookies.systemLogin);
// res.clearCookie('systemLogin');
// return res.redirect('/login');

app.use((req, res, next) => {
    console.log('req.cookies.login', typeof req.cookies.login, req.cookies.login);
    next();
});

app.get('/login', middlewareIsLogges(null, '/app'), (req, res) => {
    return res.render('login', {
        apiPath: process.env.API_PATH,
    });
});

app.post('/login', (req, res) => {
    const { token } = req.body;
    res.cookie('login', token);
    res.send('ok');
});

app.get('/logout', (req, res) => {
    res.clearCookie('login');
    return res.redirect('/');
});

app.use(expressLayouts);
app.set('layout', 'layout');

app.get('/', middlewareIsLogges('/login', null), (req, res) => {
    return res.render('app', {
        token: req.cookies.login,
        apiPath: process.env.API_PATH,
    });
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
