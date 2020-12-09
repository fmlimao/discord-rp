require('dotenv-safe').config();
const knex = require('../database/connection');

const { MessageEmbed } = require('discord.js');

function getObjectFromMention(message, mention) {
    const matches = mention.match(/^<@!?&?(\d+)>$/);

    let hasUser = false;
    let hasChannel = false;
    let hasRole = false;

    let id = null;
    if (matches) {
        id = matches[1];
        hasUser = message.guild.members.cache.get(id) || false;
        hasChannel = message.guild.channels.cache.get(id) || false;
        hasRole = message.guild.roles.cache.get(id) || false;
    }

    return {
        hasUser,
        hasChannel,
        hasRole,
    };
}

function getMessageVars(message) {
    const isBot = message.author.id == process.env.BOT_ID;
    const isDm = message.channel.type === 'dm';
    const isTextChannel = message.channel.type === 'text';
    // const isCommand = message.content.substr(0, 1) === process.env.BOT_PREFIX;

    const author = message.author;
    const member = message.member;
    const channel = message.channel;
    const guild = message.channel.guild;

    const messageContent = message.content;
    const messageMentions = message.mentions;
    // const messageContentWithoutPrefix = messageContent.slice(process.env.BOT_PREFIX.length);
    // const messageContentSplit = messageContentWithoutPrefix.split(/ +/);
    const messageContentSplit = messageContent.split(/ +/);
    const messageCommand = messageContentSplit[0];
    const messageArgs = messageContentSplit.slice(1);

    for (let i in messageArgs) {
        const mention = messageArgs[i];
        const { hasUser, hasChannel, hasRole } = getObjectFromMention(message, mention);

        messageArgs[i] = {
            content: mention,
            hasUser,
            hasChannel,
            hasRole,
        };
    }

    return {
        isBot,
        isDm,
        isTextChannel,
        // isCommand,
        author,
        member,
        channel,
        guild,
        messageContent,
        messageMentions,
        messageCommand,
        messageArgs,
    };
}

function sendMessage(to, body) {
    to.send(body);
}

function sendEmbedMessage(to, title, body, color) {
    const response = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(`${body}`);
    to.send(response);
}

// ---------------------------

async function insertGuild(guild) {
    await deleteGuild(guild);

    const data = {
        guild_id: guild.id,
        name: guild.name,
        icon: guild.iconURL(),
        region: guild.region,
        member_count: guild.memberCount,
        maximum_members: guild.maximumMembers,
        rules_channel_id: guild.rulesChannelID,
        public_updates_channel_id: guild.publicUpdatesChannelID,
        preferred_locale: guild.preferredLocale,
        owner_id: guild.ownerID,
    };

    await knex('guilds').insert(data);

    await updateGuildRoles(guild);
    await updateGuildChannels(guild);
    await updateGuildConfigs(guild);
}

async function deleteGuild(guild) {
    await knex('guilds')
        .where('guild_id', guild.id)
        .delete();

    await deleteGuildRoles(guild);
    await deleteGuildChannels(guild);
    await deleteGuildConfigs(guild);
}

async function updateGuild(oldGuild, newGuild) {
    await deleteGuild(newGuild);
    await insertGuild(newGuild);
}

// ---------------------------

async function insertGuildRole(role) {
    const data = {
        guild_id: role.guild.id,
        role_id: role.id,
        name: role.name,
        color: role.color,
        hoist: role.hoist ? 1 : 0,
        raw_position: role.rawPosition,
        permissions: role.permissions.bitfield,
        managed: role.managed ? 1 : 0,
        mentionable: role.mentionable ? 1 : 0,
    };

    await knex('roles').insert(data);
}

async function deleteGuildRole(role) {
    await knex('roles')
        .where('guild_id', role.guild.id)
        .where('role_id', role.id)
        .delete();
}

async function updateGuildRole(oldRole, newRole) {
    await deleteGuildRole(newRole);
    await insertGuildRole(newRole);
}

// ---------------------------

async function deleteGuildRoles(guild) {
    await knex('roles')
        .where('guild_id', guild.id)
        .delete();
}

async function updateGuildRoles(guild) {
    await deleteGuildRoles(guild);

    const roles = await guild.roles.cache.map(role => {
        return {
            guild_id: guild.id,
            role_id: role.id,
            name: role.name,
            color: role.color,
            hoist: role.hoist ? 1 : 0,
            raw_position: role.rawPosition,
            permissions: role.permissions.bitfield,
            managed: role.managed ? 1 : 0,
            mentionable: role.mentionable ? 1 : 0,
        };
    });

    await knex('roles').insert(roles);
}

// ---------------------------

// ---------------------------

async function insertGuildChannel(channel) {
    const data = {
        guild_id: channel.guild.id,
        channel_id: channel.id,
        name: channel.name,
        type: channel.type,
        raw_position: channel.rawPosition,
        parent_id: channel.parentID,
    };

    await knex('channels').insert(data);
}

async function deleteGuildChannel(channel) {
    await knex('channels')
        .where('guild_id', channel.guild.id)
        .where('channel_id', channel.id)
        .delete();
}

async function updateGuildChannel(oldChannel, newChannel) {
    await deleteGuildChannel(newChannel);
    await insertGuildChannel(newChannel);
}

// ---------------------------

async function deleteGuildChannels(guild) {
    await knex('channels')
        .where('guild_id', guild.id)
        .delete();
}

async function updateGuildChannels(guild) {
    await deleteGuildChannels(guild);

    const channels = await guild.channels.cache
        .map(channel => {
            return {
                guild_id: channel.guild.id,
                channel_id: channel.id,
                name: channel.name,
                type: channel.type,
                raw_position: channel.rawPosition,
                parent_id: channel.parentID,
            };
        });

    await knex('channels').insert(channels);
}

// ---------------------------

async function insertGuildConfig(guild, key, value) {
    const data = {
        guild_id: guild.id,
        key: key,
        value: value,
    };

    await knex('guild_configs').insert(data);
}

async function deleteGuildConfig(guild, key) {
    await knex('roles')
        .where('guild_id', guild.id)
        .where('key', key)
        .delete();
}

async function updateGuildConfig(guild, key, value) {
    await deleteGuildConfig(guild, key);
    await insertGuildConfig(guild, key, value);
}

// ---------------------------

const guildConfigsDefault = {
    prefix: '!',
    bot_alias: 'MODERATOR',
    command_ban_guilds_allowed: '[]',
    command_ban_roles_allowed: '[]',
};

const configsJson = ['command_ban_guilds_allowed', 'command_ban_roles_allowed'];

async function deleteGuildConfigs(guild) {
    await knex('guild_configs')
        .where('guild_id', guild.id)
        .delete();
}

async function updateGuildConfigs(guild) {
    await deleteGuildConfigs(guild);

    for (let i in guildConfigsDefault) {
        await insertGuildConfig(guild, i, guildConfigsDefault[i]);
    }
}

async function getGuildConfigs() {
    const configs = {};

    const data = await knex('guild_configs')
        .select('guild_id', 'key', 'value')
        .orderBy(['guild_id', 'key']);

    for (let i in data) {
        const config = data[i];

        if (typeof configs[config.guild_id] === 'undefined') {
            configs[config.guild_id] = JSON.parse(JSON.stringify(guildConfigsDefault));
        }

        configs[config.guild_id][config.key] = config.value;
    }

    for (let guild_id in configs) {
        for (let i in configsJson) {
            configs[guild_id][configsJson[i]] = JSON.parse(configs[guild_id][configsJson[i]]);
        }
    }

    return configs;
}

// ---------------------------

module.exports = {
    getMessageVars,
    sendMessage,
    sendEmbedMessage,

    insertGuild,
    deleteGuild,
    updateGuild,

    insertGuildRole,
    deleteGuildRole,
    updateGuildRole,

    deleteGuildRoles,
    updateGuildRoles,

    insertGuildChannel,
    deleteGuildChannel,
    updateGuildChannel,

    deleteGuildChannels,
    updateGuildChannels,

    insertGuildConfig,
    deleteGuildConfig,
    updateGuildConfig,

    deleteGuildConfigs,
    updateGuildConfigs,
    getGuildConfigs,
};
