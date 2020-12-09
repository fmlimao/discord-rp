
exports.up = function (knex) {
    return knex.schema.createTable('channels', table => {
        table.varchar('guild_id');
        table.varchar('channel_id');
        table.varchar('name');
        table.varchar('type');
        table.integer('raw_position');
        table.varchar('parent_id');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('channels');
};
