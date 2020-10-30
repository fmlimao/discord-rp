module.exports = {

    up: function (knex) {
        return knex.schema.createTable('ds_channels', table => {
            table.varchar('guild_id').notNullable();
            table.varchar('channel_id').notNullable();
            table.varchar('name');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('ds_channels');
    },

};
