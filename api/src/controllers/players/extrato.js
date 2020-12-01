const knex = require('../../database/connection');
const utf8 = require('utf8');
const number_format = require('../../helpers/number-format');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const { player_id } = req.params;

        const transactions = (await knex.raw(`
            SELECT
                vumt.user_id AS player_id,
                dgm.username,
                dgm.avatar,
                dgm.nickname,
                dgm.roles,
                vumt.id AS transaction_id,
                vumt.old_wallet,vumt.new_wallet,
                vumt.old_bank,vumt.new_bank,
                vumt.old_paypal,vumt.new_paypal,
                (vumt.new_wallet - vumt.old_wallet) AS diff_wallet,
                (vumt.new_bank - vumt.old_bank) AS diff_bank,
                (vumt.new_paypal - vumt.old_paypal) AS diff_paypal,
                vumt.created_at
            FROM vrp_user_money_transactions AS vumt
            LEFT JOIN discord_whitelist AS dw ON (dw.deleted_at IS NULL AND vumt.user_id = dw.player_id AND dw.guild_id = ?)
            LEFT JOIN discord_guild_members AS dgm ON (dgm.deleted_at IS NULL AND dw.member_id = dgm.member_id AND dw.guild_id = dgm.guild_id)
            WHERE vumt.user_id = ?
            ORDER BY vumt.user_id, vumt.created_at, vumt.id
            ;
        `, [process.env.DS_GUILD, player_id]))[0];

        if (!transactions.length) {
            ret.setCode(404);
            throw new Error('Usuário não encontrado.');
        }

        const playerData = {};

        let beforeIndex = null;
        for (let i in transactions) {
            const transaction = transactions[i];

            if (i == 0) {
                playerData.player_id = '';
                if (transaction.player_id) playerData.player_id = transaction.player_id;

                playerData.username = '';
                if (transaction.username) playerData.username = utf8.decode(transaction.username);

                playerData.avatar = '';
                if (transaction.avatar) playerData.avatar = transaction.avatar;

                playerData.nickname = '';
                if (transaction.nickname) playerData.nickname = utf8.decode(transaction.nickname);

                playerData.roles = [];
                if (transaction.roles) {
                    playerData.roles = JSON.parse(transaction.roles);

                    playerData.roles.sort((a, b) => {
                        if (a.rawPosition < b.rawPosition) return 1;
                        if (a.rawPosition > b.rawPosition) return -1;
                        return 0;
                    });

                    playerData.roles = playerData.roles.map(role => {
                        role.name = utf8.decode(role.name);
                        return role;
                    });
                }
            }

            delete transaction.player_id;
            delete transaction.username;
            delete transaction.avatar;
            delete transaction.nickname;
            delete transaction.roles;

            transaction.has_wallet = transaction.old_wallet != null;
            transaction.old_wallet = transaction.old_wallet == null ? 0 : parseInt(transaction.old_wallet);
            transaction.new_wallet = transaction.new_wallet == null ? 0 : parseInt(transaction.new_wallet);
            transaction.diff_wallet = transaction.diff_wallet == null ? 0 : parseInt(transaction.diff_wallet);

            transaction.has_bank = transaction.old_bank != null;
            transaction.old_bank = transaction.old_bank == null ? 0 : parseInt(transaction.old_bank);
            transaction.new_bank = transaction.new_bank == null ? 0 : parseInt(transaction.new_bank);
            transaction.diff_bank = transaction.diff_bank == null ? 0 : parseInt(transaction.diff_bank);

            transaction.has_paypal = transaction.old_paypal != null;
            transaction.old_paypal = transaction.old_paypal == null ? 0 : parseInt(transaction.old_paypal);
            transaction.new_paypal = transaction.new_paypal == null ? 0 : parseInt(transaction.new_paypal);
            transaction.diff_paypal = transaction.diff_paypal == null ? 0 : parseInt(transaction.diff_paypal);

            transaction.old_wallet_formatted = number_format(transaction.old_wallet, 2, ',', '.');
            transaction.new_wallet_formatted = number_format(transaction.new_wallet, 2, ',', '.');
            transaction.diff_wallet_formatted = number_format(transaction.diff_wallet, 2, ',', '.');

            transaction.old_bank_formatted = number_format(transaction.old_bank, 2, ',', '.');
            transaction.new_bank_formatted = number_format(transaction.new_bank, 2, ',', '.');
            transaction.diff_bank_formatted = number_format(transaction.diff_bank, 2, ',', '.');

            transaction.old_paypal_formatted = number_format(transaction.old_paypal, 2, ',', '.');
            transaction.new_paypal_formatted = number_format(transaction.new_paypal, 2, ',', '.');
            transaction.diff_paypal_formatted = number_format(transaction.diff_paypal, 2, ',', '.');

            transaction.created_at_formatted = transaction.created_at.split(' ');
            transaction.created_at_formatted[0] = transaction.created_at_formatted[0].split('-').reverse().join('/');
            transaction.created_at_formatted = transaction.created_at_formatted.join(' ');

            if (transaction.username) transaction.username = utf8.decode(transaction.username);

            if (beforeIndex !== null) {
                if (!transaction.has_wallet) {
                    transaction.has_wallet = true;
                    transaction.old_wallet = transactions[beforeIndex].new_wallet;
                    transaction.new_wallet = transactions[beforeIndex].new_wallet;
                    transaction.diff_wallet = 0;

                    transaction.old_wallet_formatted = number_format(transaction.old_wallet, 2, ',', '.');
                    transaction.new_wallet_formatted = number_format(transaction.new_wallet, 2, ',', '.');
                    transaction.diff_wallet_formatted = number_format(transaction.diff_wallet, 2, ',', '.');
                }

                if (!transaction.has_bank) {
                    transaction.has_bank = true;
                    transaction.old_bank = transactions[beforeIndex].new_bank;
                    transaction.new_bank = transactions[beforeIndex].new_bank;
                    transaction.diff_bank = 0;

                    transaction.old_bank_formatted = number_format(transaction.old_bank, 2, ',', '.');
                    transaction.new_bank_formatted = number_format(transaction.new_bank, 2, ',', '.');
                    transaction.diff_bank_formatted = number_format(transaction.diff_bank, 2, ',', '.');
                }

                if (!transaction.has_paypal) {
                    transaction.has_paypal = true;
                    transaction.old_paypal = transactions[beforeIndex].new_paypal;
                    transaction.new_paypal = transactions[beforeIndex].new_paypal;
                    transaction.diff_paypal = 0;

                    transaction.old_paypal_formatted = number_format(transaction.old_paypal, 2, ',', '.');
                    transaction.new_paypal_formatted = number_format(transaction.new_paypal, 2, ',', '.');
                    transaction.diff_paypal_formatted = number_format(transaction.diff_paypal, 2, ',', '.');
                }
            }

            beforeIndex = i;
        }

        ret.addContent('playerData', playerData);
        ret.addContent('transactions', transactions);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
