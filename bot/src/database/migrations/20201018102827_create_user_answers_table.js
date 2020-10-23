module.exports = {

    up: function (knex) {
        return knex.schema.createTable('wl_user_answers', table => {
            table.increments('user_answer_id').primary();

            table.bigInteger('user_id').notNullable();
            table.integer('question_id').notNullable();
            table.integer('answer_id');
            table.varchar('value');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('wl_user_answers');
    },

};
