module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_whitelist', table => {
            table.varchar('user_id');

            table.varchar('channel_id');

            table.varchar('user_name');
            table.varchar('user_email');
            table.varchar('user_birth');

            table.varchar('player_name');
            table.varchar('player_id');

            table.datetime('finished_at');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_whitelist');
    },

};
