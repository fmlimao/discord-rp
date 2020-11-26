const knex = require('../../database/connection');
const utf8 = require('utf8');
const number_format = require('../../helpers/number-format');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const players = await knex('vrp_users AS vu')
            .leftJoin('discord_whitelist AS dw', function () {
                this.onNull('dw.deleted_at')
                    .andOn('vu.id', '=', 'dw.player_id');
            })
            .leftJoin('discord_users AS du', function () {
                this.onNull('du.deleted_at')
                    .andOn('dw.user_id', '=', 'du.user_id');
            })
            .leftJoin('vrp_user_moneys AS vum', function () {
                this.on('vu.id', '=', 'vum.user_id');
            })
            .leftJoin('vrp_user_data AS vud', function () {
                this.on('vu.id', '=', 'vud.user_id')
                    .andOn(knex.raw("vud.dkey = 'vRP:paypal'"));
            })
            .where('vu.whitelisted', 1)
            .orderBy('vu.id')
            .select(
                'vu.id AS player_id',
                'du.username',
                'du.avatar',
                'vum.wallet',
                'vum.bank',
                'vud.dvalue AS paypal'
            );

            players.map(player => {
                player.wallet = player.wallet == null ? 0 : parseInt(player.wallet);
                player.bank = player.bank == null ? 0 : parseInt(player.bank);
                player.paypal = player.paypal == null ? 0 : parseInt(player.paypal);
                player.wallet_formatted = number_format(player.wallet, 2, ',', '.');
                player.bank_formatted = number_format(player.bank, 2, ',', '.');
                player.paypal_formatted = number_format(player.paypal, 2, ',', '.');
                if (player.username) player.username = utf8.decode(player.username);
                return player;
            });

        ret.addContent('players', players);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
