module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_whitelist_question_answers', table => {
            table.increments('answer_id').primary();
            table.integer('question_id').notNullable();

            table.varchar('description').notNullable();
            table.integer('option').notNullable();
            table.integer('is_correct').notNullable().defaultTo(0);
            table.integer('order').notNullable();

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_whitelist_question_answers');
    },

};
