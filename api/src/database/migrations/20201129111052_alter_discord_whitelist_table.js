module.exports = {

    up: function (knex) {
        return knex.schema.table('discord_whitelist', table => {
            table.renameColumn('user_id', 'member_id');
            table.varchar('guild_id').after('user_id');
        });
    },

    down: async function (knex) {
        return knex.schema.table('discord_whitelist', table => {
            table.renameColumn('member_id', 'user_id');
            table.dropColumn('guild_id');
        });
    },

};
