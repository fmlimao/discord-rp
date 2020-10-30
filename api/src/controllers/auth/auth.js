const knex = require('../../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const messagesValidator = require('../../validators/messages');

module.exports = async (req, res) => {
    let ret = req.ret;
    ret.addFields(['email', 'password']);

    try {
        let { email, password } = req.body;

        // Validando formulário
        const dataValidate = new Validator({
            email,
            password,
        }, {
            email: 'required|string|email',
            password: 'required|string',
        }, messagesValidator);

        const fails = dataValidate.fails();
        const errors = dataValidate.errors.all();

        if (fails) {
            for (let field in errors) {
                let messages = errors[field];
                ret.setFieldError(field, true);

                for (let i in messages) {
                    let message = messages[i];
                    ret.addFieldMessage(field, message);
                }
            }

            ret.setCode(400);
            throw new Error('Verifique todos os campos.');
        }

        // Verificando se usuário ja existe
        const user = await knex('bot_users')
            .where('bot_users.deleted_at', null)
            .where('bot_users.active', 1)
            .where('bot_users.email', email)
            .select('bot_users.user_id AS id', 'bot_users.name', 'bot_users.email', 'bot_users.password')
            .first();

        if (!user) {
            ret.setCode(400);
            throw new Error('Usuário não encontrado.');
        }

        const passwordVerify = bcrypt.compareSync(password, user.password);

        if (!passwordVerify) {
            ret.setCode(400);
            throw new Error('Usuário não encontrado.');
        }

        const login = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const exp = Number(process.env.TOKEN_EXPIRATION_SEC);
        if (exp) {
            login.exp = Math.floor(Date.now() / 1000) + exp;
        }

        const key = process.env.TOKEN_SECRET;
        const token = jwt.sign(login, key);

        ret.addContent('token', token);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
