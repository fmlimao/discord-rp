const knex = require('../../database/connection');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const users = await knex('bot_users')
            .where('bot_users.deleted_at', null)
            .where('bot_users.active', 1)
            .orderBy('bot_users.name')
            .select('bot_users.user_id', 'bot_users.name', 'bot_users.email', 'bot_users.active');

        ret.addContent('users', users);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
