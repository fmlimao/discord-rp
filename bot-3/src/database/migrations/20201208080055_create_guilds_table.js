
exports.up = function (knex) {
    return knex.schema.createTable('guilds', table => {
        table.varchar('guild_id');
        table.varchar('name');
        table.varchar('icon');
        table.varchar('region');
        table.integer('member_count');
        table.integer('maximum_members');
        table.varchar('rules_channel_id');
        table.varchar('public_updates_channel_id');
        table.varchar('preferred_locale');
        table.varchar('owner_id');

        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('guilds');
};
