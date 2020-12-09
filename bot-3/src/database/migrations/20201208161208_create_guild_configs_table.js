
exports.up = function (knex) {
    return knex.schema.createTable('guild_configs', table => {
        table.varchar('guild_id');
        table.varchar('key');
        table.text('value');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('guild_configs');
};
