module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_users', table => {
            table.bigInteger('user_id');
            table.varchar('username');
            table.varchar('avatar');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_users');
    },

};
