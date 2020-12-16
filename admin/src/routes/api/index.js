const express = require('express');
const router = express.Router();

router.use(require('../../middlewares/json-return'));

router.use((req, res, next) => {
    if (
        !res.locals.token
        || !res.locals.user
        || !res.locals.guild

    ) {
        req.ret.code = 401;
        throw new Error('Usuário deslogado');
    }

    next();
});

router.use('/rules', require('./rules'));

router.use(require('./error-404'));
router.use(require('./error-500'));

module.exports = router;