const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

module.exports = async (req, res, next) => {
    const ret = req.ret;

    try {
        const token = req.header('x-access-token');

        if (!token) {
            ret.setCode(401);
            throw new Error('Token inválido.');
        }

        const key = process.env.TOKEN_SECRET;
        const decodedToken = jwt.verify(token, key);

        const user = await knex('bot_users')
            .where('bot_users.deleted_at', null)
            .where('bot_users.active', 1)
            .where('bot_users.user_id', decodedToken.id)
            .select('bot_users.user_id', 'bot_users.name', 'bot_users.email', 'bot_users.active')
            .first();

        if (!user) {
            ret.setCode(401);
            throw new Error('Token inválido.');
        }

        req.auth = { user };
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            ret.setCode(401);
            throw new Error('Token inválido.');
        } else if (err.name === 'TokenExpiredError') {
            ret.setCode(401);
            ret.addMessage('Token expirado.');
        } else {
            ret.setError(true);

            if (err.message) {
                ret.addMessage(err.message);
            }
        }

        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
