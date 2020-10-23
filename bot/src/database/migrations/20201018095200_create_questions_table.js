module.exports = {

    up: function (knex) {
        return knex.schema.createTable('wl_questions', table => {
            table.increments('question_id').primary();

            table.enu('type', ['options', 'text']).notNullable().defaultTo('options');
            table.varchar('description').notNullable();
            table.integer('order').notNullable();

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('wl_questions');
    },

};
