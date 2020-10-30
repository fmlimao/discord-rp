module.exports = {

    up: function (knex) {
        return knex.schema.createTable('ds_permissions', table => {
            table.varchar('guild_id').notNullable();
            table.varchar('role_id');
            table.varchar('channel_id');

            table.integer('CREATE_INSTANT_INVITE').defaultTo(0);
            table.integer('KICK_MEMBERS').defaultTo(0);
            table.integer('BAN_MEMBERS').defaultTo(0);
            table.integer('ADMINISTRATOR').defaultTo(0);
            table.integer('MANAGE_CHANNELS').defaultTo(0);
            table.integer('MANAGE_GUILD').defaultTo(0);
            table.integer('ADD_REACTIONS').defaultTo(0);
            table.integer('VIEW_AUDIT_LOG').defaultTo(0);
            table.integer('PRIORITY_SPEAKER').defaultTo(0);
            table.integer('STREAM').defaultTo(0);
            table.integer('VIEW_CHANNEL').defaultTo(0);
            table.integer('SEND_MESSAGES').defaultTo(0);
            table.integer('SEND_TTS_MESSAGES').defaultTo(0);
            table.integer('MANAGE_MESSAGES').defaultTo(0);
            table.integer('EMBED_LINKS').defaultTo(0);
            table.integer('ATTACH_FILES').defaultTo(0);
            table.integer('READ_MESSAGE_HISTORY').defaultTo(0);
            table.integer('MENTION_EVERYONE').defaultTo(0);
            table.integer('USE_EXTERNAL_EMOJIS').defaultTo(0);
            table.integer('VIEW_GUILD_INSIGHTS').defaultTo(0);
            table.integer('CONNECT').defaultTo(0);
            table.integer('SPEAK').defaultTo(0);
            table.integer('MUTE_MEMBERS').defaultTo(0);
            table.integer('DEAFEN_MEMBERS').defaultTo(0);
            table.integer('MOVE_MEMBERS').defaultTo(0);
            table.integer('USE_VAD').defaultTo(0);
            table.integer('CHANGE_NICKNAME').defaultTo(0);
            table.integer('MANAGE_NICKNAMES').defaultTo(0);
            table.integer('MANAGE_ROLES').defaultTo(0);
            table.integer('MANAGE_WEBHOOKS').defaultTo(0);
            table.integer('MANAGE_EMOJIS').defaultTo(0);
        });
    },

    down: async function (knex) {
        return knex.schema.dropTable('ds_permissions');
    },

};
