const express = require('express');

const router = express.Router();

/* Middlewares */
const middlewareAuth = require('./middlewares/auth');
const middlewareCheckIfPlayerExists = require('./middlewares/check-if-player-exists');
// const middlewareCheckIfUserExists = require('./middlewares/check-if-user-exists');

router.get('/', require('./controllers/home'));

router.post('/auth', require('./controllers/auth/auth'));

// router.post('/users', middlewareAuth, require('./controllers/users/store'));
router.get('/users', middlewareAuth, require('./controllers/users/list'));
// router.get('/users/:user_id', middlewareAuth, middlewareCheckIfUserExists, require('./controllers/users/show'));

// router.get('/whitelist/questions', middlewareAuth, require('./controllers/whitelist/questions/list'));
// router.get('/whitelist/answers', middlewareAuth, require('./controllers/whitelist/answers/list'));

router.get('/players', middlewareAuth, require('./controllers/players/list'));
router.get('/players/:player_id', middlewareAuth, middlewareCheckIfPlayerExists, require('./controllers/players/show'));
router.get('/players/:player_id/transactions', middlewareAuth, require('./controllers/players/transactions'));

module.exports = router;
