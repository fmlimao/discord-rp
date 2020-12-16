module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_rules', table => {
            table.increments('rule_id').primary();

            table.varchar('version');
            table.integer('draft');
            table.integer('current');
            table.text('content');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_rules');
    },

};
