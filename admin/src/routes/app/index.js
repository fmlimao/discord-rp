const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/app/dashboard');
});

router.get('/dashboard', require('./dashboard'));

router.get('/players', require('./players/list'));

router.get('/rules', require('./rules'));

router.use(require('./error-404'));
router.use(require('./error-500'));

module.exports = router;