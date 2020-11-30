module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_guild_members', table => {
            table.varchar('guild_id');
            table.varchar('member_id');
            table.varchar('username');
            table.varchar('avatar');
            table.varchar('nickname');
            table.text('roles');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_guild_members');
    },

};
