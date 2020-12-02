module.exports = {

    up: function (knex) {
        return knex.schema.table('discord_system_users', table => {
            table.varchar('member_id').after('salt');
        });
    },

    down: async function (knex) {
        return knex.schema.table('discord_system_users', table => {
            table.dropColumn('member_id');
        });
    },

};
