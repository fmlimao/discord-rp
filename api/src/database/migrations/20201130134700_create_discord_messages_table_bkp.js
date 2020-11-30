module.exports = {

    up: function (knex) {
        return knex.schema.createTable('discord_messages_bkp', table => {
            table.integer('message_id');

            table.integer('is_bot');
            table.integer('is_dm');
            table.integer('is_text_channel');
            table.varchar('guild_id');
            table.varchar('guild_name');
            table.varchar('channel_id');
            table.varchar('channel_name');
            table.varchar('member_id');
            table.varchar('member_username');
            table.varchar('member_avatar');
            table.varchar('member_nickname');
            table.text('roles');
            table.text('message_content');

            table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
            table.datetime('deleted_at');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('discord_messages_bkp');
    },

};
