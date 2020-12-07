const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const Validator = require('validatorjs');
const messagesValidator = require('../../validators/messages');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        ret.addContent('player', req.player);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
