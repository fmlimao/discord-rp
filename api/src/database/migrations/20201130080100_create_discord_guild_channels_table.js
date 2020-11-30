module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_guild_channels', table => {
            table.varchar('guild_id');
            table.varchar('channel_id');
            table.varchar('name');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_guild_channels');
    },

};
