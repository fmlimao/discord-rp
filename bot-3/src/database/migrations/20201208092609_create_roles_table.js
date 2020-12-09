
exports.up = function (knex) {
    return knex.schema.createTable('roles', table => {
        table.varchar('guild_id');
        table.varchar('role_id');
        table.varchar('name');
        table.integer('color');
        table.integer('hoist');
        table.integer('raw_position');
        table.bigInteger('permissions');
        table.integer('managed');
        table.integer('mentionable');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('roles');
};
