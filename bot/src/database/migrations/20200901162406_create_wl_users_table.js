module.exports = {

    up: function (knex) {
        return knex.schema.createTable('wl_users', table => {
            table.bigInteger('user_id');
            table.varchar('ds_username');

            table.varchar('user_name');
            table.varchar('user_email');
            table.varchar('user_born');
            table.varchar('player_name');
            table.bigInteger('player_id');
            table.datetime('finished_at');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('wl_users');
    },

};
