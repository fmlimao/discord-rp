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

const middlwareVerifyLogged = require('./src/middlewares/verify-logged');
const middlwareVerifyNotLogged = require('./src/middlewares/verify-not-logged');
const middlwareJsonReturn = require('./src/middlewares/json-return');

app.use(middlwareJsonReturn);

app.use((req, res, next) => {
    req.apiHost = process.env.API_HOST;
    next();
});

app.get('/login', middlwareVerifyLogged, (req, res) => {
    return res.render('login', {
        apiHost: req.apiHost,
    });
});

app.post('/login', (req, res) => {
    let ret = req.ret;
    ret.addFields(['token']);

    try {
        let { token } = req.body;

        if (!token) {
            ret.setFieldError('token', true, 'Campo obrigatório.');
            ret.setCode(400);
            throw new Error('Verifique todos os campos.');
        }

        res.cookie('systemLogin', token);

        console.log('req.cookies.systemLogin', req.cookies.systemLogin);
    } catch (err) {
        ret.setError(true);
        if (ret.getCode() === 200) {
            ret.setCode(500);
            ret.addMessage('Erro interno. Por favor, tente novamente.');

            console.log(`[ERRO INTERNO]: ${err}`);
        } else {
            if (err.message) {
                ret.addMessage(err.message);
            }
        }
    }

    return res.status(ret.getCode()).json(ret.generate());
});

app.get('/logout', middlwareVerifyNotLogged, (req, res) => {
    res.clearCookie('systemLogin');
    return res.redirect('/login');
});

app.use(expressLayouts);
app.set('layout', 'layout');

app.get('/', middlwareVerifyNotLogged, (req, res) => {
    return res.render('home', {
        apiHost: req.apiHost,
        appVersion: process.env.APP_VERSION,
        token: req.token,
        auth: req.auth,
        page: 'home',
    });
});

app.get('/players', middlwareVerifyNotLogged, (req, res) => {
    return res.render('players/list', {
        apiHost: req.apiHost,
        appVersion: process.env.APP_VERSION,
        token: req.token,
        auth: req.auth,
        page: 'players',
    });
});

app.get('/players/:player_id', middlwareVerifyNotLogged, (req, res) => {
    const { player_id } = req.params;
    console.log('player_id', player_id);
    return res.render('players/show', {
        apiHost: req.apiHost,
        appVersion: process.env.APP_VERSION,
        token: req.token,
        auth: req.auth,
        page: 'players',
        player_id: player_id,
    });
});







// const middlewareIsLogged = (isLoggedPath, isNotLoggedPath) => {
//     return (req, res, next) => {
//         // logado
//         if (req.cookies.login) {
//             if (isLoggedPath) return res.redirect(isLoggedPath);
//         }

//         // deslogado
//         if (!req.cookies.login) {
//             if (isNotLoggedPath) return res.redirect(isNotLoggedPath);
//         }

//         return next();
//     };
// };

// res.cookie('systemLogin', token);
// console.log('req.cookies.systemLogin', req.cookies.systemLogin);
// res.clearCookie('systemLogin');
// return res.redirect('/login');

// app.use((req, res, next) => {
//     console.log('req.cookies.login', typeof req.cookies.login, req.cookies.login);
//     next();
// });

// app.get('/login', middlewareIsLogged('/app', null), (req, res) => {
//     return res.render('login', {
//         apiPath: process.env.API_PATH,
//     });
// });

// app.post('/login', (req, res) => {
//     const { token } = req.body;
//     res.cookie('login', token);
//     res.send('ok');
// });

// app.get('/logout', (req, res) => {
//     res.clearCookie('login');
//     return res.redirect('/');
// });

// app.use(expressLayouts);
// app.set('layout', 'layout');

// app.get('/', middlewareIsLogged(null, '/login'), (req, res) => {
//     return res.render('app', {
//         token: req.cookies.login,
//         apiPath: process.env.API_PATH,
//         appVersion: process.env.APP_VERSION,
//     });
// });

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
