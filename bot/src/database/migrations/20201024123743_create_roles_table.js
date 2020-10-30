module.exports = {

    up: function (knex) {
        return knex.schema.createTable('ds_roles', table => {
            table.varchar('guild_id').notNullable();
            table.varchar('role_id').notNullable();
            table.varchar('name');
            table.integer('raw_position');
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('ds_roles');
    },

};
