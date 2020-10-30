const knex = require('../database/connection');

module.exports = async (req, res, next) => {
    const ret = req.ret;

    try {
        const { user_id } = req.params;

        const user = await knex('bot_users')
            .where('bot_users.deleted_at', null)
            .where('bot_users.active', 1)
            .where('bot_users.user_id', user_id)
            .select('bot_users.user_id', 'bot_users.name', 'bot_users.email', 'bot_users.active')
            .first();

        if (!user) {
            ret.setCode(401);
            throw new Error('Token inválido.');
        }

        req.user = user;
    } catch (err) {
        ret = require('../helpers/error-handler')(err, ret);
        return res.status(ret.getCode()).json(ret.generate());
    }

    next();
};
