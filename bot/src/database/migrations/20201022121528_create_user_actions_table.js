module.exports = {

    up: function (knex) {
        return knex.schema.createTable('wl_user_actions', table => {
            table.increments('user_action_id').primary();

            table.bigInteger('user_id').notNullable();
            table.varchar('action');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('wl_user_actions');
    },

};
