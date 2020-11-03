const knex = require('../../database/connection');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const users = await knex('discord_system_users')
            .where('deleted_at', null)
            .where('active', 1)
            .orderBy('name')
            .select('user_id', 'name', 'email', 'active');

        ret.addContent('users', users);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
