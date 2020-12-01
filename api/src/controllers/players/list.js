require('dotenv-safe').config();

const knex = require('../../database/connection');
const utf8 = require('utf8');
const number_format = require('../../helpers/number-format');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const players = (await knex.raw(`
            SELECT
                vu.id AS player_id
                , vu.whitelisted
                , vu.banned
                , dgm.member_id
                , dgm.username
                , dgm.avatar
                , dgm.nickname
                , dgm.roles
                , vum.wallet
                , vum.bank
                , vud.dvalue AS paypal
            FROM vrp_users vu
            LEFT JOIN discord_whitelist AS dw ON (dw.deleted_at IS NULL AND vu.id = dw.player_id AND dw.guild_id = ?)
            LEFT JOIN discord_guild_members dgm ON (dgm.deleted_at IS NULL AND dw.member_id = dgm.member_id AND dw.guild_id = dgm.guild_id)
            LEFT JOIN vrp_user_moneys AS vum ON (vu.id = vum.user_id)
            LEFT JOIN vrp_user_data AS vud ON (vu.id = vud.user_id AND vud.dkey = 'vRP:paypal')
            GROUP BY vu.id
            ORDER BY vu.id
            ;
        `, [process.env.DS_GUILD]))[0];

        players.map(player => {
            player.wallet = player.wallet == null ? 0 : parseInt(player.wallet);
            player.bank = player.bank == null ? 0 : parseInt(player.bank);
            player.paypal = player.paypal == null ? 0 : parseInt(player.paypal);
            player.wallet_formatted = number_format(player.wallet, 2, ',', '.');
            player.bank_formatted = number_format(player.bank, 2, ',', '.');
            player.paypal_formatted = number_format(player.paypal, 2, ',', '.');

            player.money = player.wallet + player.bank + player.paypal;
            player.money_formatted = number_format(player.money, 2, ',', '.');

            if (player.username) player.username = utf8.decode(player.username);

            if (player.nickname) player.nickname = utf8.decode(player.nickname);

            if (player.roles) {
                player.roles = JSON.parse(player.roles);

                player.roles.sort((a, b) => {
                    if (a.rawPosition < b.rawPosition) return 1;
                    if (a.rawPosition > b.rawPosition) return -1;
                    return 0;
                });

                player.roles = player.roles.map(role => {
                    role.name = utf8.decode(role.name);
                    return role;
                });
            }

            return player;
        });

        console.log('players', players);

        ret.addContent('players', players);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
