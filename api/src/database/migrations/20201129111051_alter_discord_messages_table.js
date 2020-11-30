module.exports = {

    up: function (knex) {
        return knex.schema.table('discord_messages', table => {
            table.renameColumn('author_id', 'member_id');
            table.renameColumn('author_username', 'member_username');
            table.renameColumn('author_avatar', 'member_avatar');
        });
    },

    down: async function (knex) {
        return knex.schema.table('discord_messages', table => {
            table.renameColumn('member_id', 'author_id');
            table.renameColumn('member_username', 'author_username');
            table.renameColumn('member_avatar', 'author_avatar');
        });
    },

};
