const knex = require('../../database/connection');
const utf8 = require('utf8');
const number_format = require('../../helpers/number-format');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const { player_id } = req.params;

        /*
        SELECT
            vumt.user_id AS player_id,
            du.username,
            du.avatar,
            vumt.id AS transaction_id,
            vumt.old_wallet,vumt.new_wallet,
            vumt.old_bank,vumt.new_bank,
            vumt.old_paypal,vumt.new_paypal,
            (vumt.new_wallet - vumt.old_wallet) AS diff_wallet,
            (vumt.new_bank - vumt.old_bank) AS diff_bank,
            (vumt.new_paypal - vumt.old_paypal) AS diff_paypal,
            vumt.created_at
        FROM vrp_user_money_transactions AS vumt
        LEFT JOIN discord_whitelist AS dw ON (dw.deleted_at IS NULL AND vumt.user_id = dw.player_id)
        LEFT JOIN discord_users AS du ON (du.deleted_at IS NULL AND dw.user_id = du.user_id)
        WHERE vumt.user_id = 2
        ORDER BY vumt.user_id, vumt.created_at, vumt.id;
        */

        const transactions = await knex('vrp_user_money_transactions AS vumt')
            .leftJoin('discord_whitelist AS dw', function () {
                this.onNull('dw.deleted_at')
                    .andOn('vumt.user_id', '=', 'dw.player_id');
            })
            .leftJoin('discord_users AS du', function () {
                this.onNull('du.deleted_at')
                    .andOn('dw.user_id', '=', 'du.user_id');
            })
            .where('vumt.user_id', player_id)
            .orderBy(['vumt.user_id', 'vumt.created_at', 'vumt.id'])
            .select(
                'vumt.user_id AS player_id',
                'du.username',
                'du.avatar',
                'vumt.id AS transaction_id',
                'vumt.old_wallet',
                'vumt.new_wallet',
                'vumt.old_bank',
                'vumt.new_bank',
                'vumt.old_paypal',
                'vumt.new_paypal',
                knex.raw('(vumt.new_wallet - vumt.old_wallet) AS diff_wallet'),
                knex.raw('(vumt.new_bank - vumt.old_bank) AS diff_bank'),
                knex.raw('(vumt.new_paypal - vumt.old_paypal) AS diff_paypal'),
                'vumt.created_at'
            );

        if (!transactions) {
            ret.setCode(404);
            throw new Error('Usuário não encontrado.');
        }

        // transactions.map(transaction => {
        let beforeIndex = null;
        for (let i in transactions) {
            const transaction = transactions[i];
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

            // return transaction;
        }
        // });

        ret.addContent('transactions', transactions);
    } catch (err) {
        ret = require('../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
