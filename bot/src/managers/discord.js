const { MessageEmbed } = require('discord.js');
const utf8 = require('utf8');
const knex = require('../database/connection');

// function getUserFromMention(mention) {
//     if (!mention) return;

//     if (mention.startsWith('<@') && mention.endsWith('>')) {
//         mention = mention.slice(2, -1);

//         if (mention.startsWith('!')) {
//             mention = mention.slice(1);
//         }

//         return client.users.cache.get(mention);
//     }
// }

// function getChannelFromMention(mention) {
//     if (!mention) return;

//     if (mention.startsWith('<#') && mention.endsWith('>')) {
//         mention = mention.slice(2, -1);

//         if (mention.startsWith('!')) {
//             mention = mention.slice(1);
//         }

//         return client.channels.cache.get(mention);
//     }
// }

function getMessageVars(message/*, commands*/) {
    const isBot = message.author.id == process.env.BOT_ID;
    const isDm = message.channel.type === 'dm';
    const isTextChannel = message.channel.type === 'text';
    const isCommand = message.content.substr(0, 1) === process.env.BOT_PREFIX;

    const author = message.author;
    const channel = message.channel;
    const guild = message.channel.guild;

    const messageContent = message.content;
    const messageMentions = message.mentions;
    const messageContentWithoutPrefix = messageContent.slice(process.env.BOT_PREFIX.length);
    const messageContentSplit = messageContentWithoutPrefix.split(/ +/);
    const messageCommand = messageContentSplit[0];
    const messageArgs = messageContentSplit.slice(1);
    // const isValidCommand = isCommand && checkIsValidCommand(message, commands, messageContent);

    return {
        isBot,
        isDm,
        isTextChannel,
        isCommand,
        author,
        channel,
        guild,
        messageContent,
        messageMentions,
        // messageContentWithoutPrefix,
        // messageContentSplit,
        messageCommand,
        messageArgs,
        // isValidCommand,
    };
}

function checkIsValidCommand(message, commands, messageContent) {
    let commandExists = false;

    for (let commandId in commands) {
        const re = new RegExp(commands[commandId].command, 'g');
        const result = re.exec(messageContent);

        if (result) {
            commandExists = commandId;
            break;
        }
    }

    return commandExists;
}

function sendMessage(to, title, body, color) {
    const response = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(`${body}`);
    to.send(response);
}

async function reloadDiscordDatabase(client) {

    const execute = false;
    const db = false;

    if (execute) {

        if (db) {
            await knex('ds_guilds').truncate();
            await knex('ds_roles').truncate();
            await knex('ds_permissions').truncate();
            await knex('ds_channels').truncate();
        }

        client.guilds.cache.map(async guild => {
            // const guild_id = '765566693967527957';
            // const guild = client.guilds.cache.get(guild_id);
            const roles = guild.roles;
            const channels = guild.channels;
            // const members = guild.members;

            console.log(`----------------------`);
            console.log(' - GUILD:', guild.id, guild.name);
            if (db) await knex('ds_guilds').insert({ guild_id: guild.id, name: utf8.encode(guild.name) });

                console.log(`----------------------`);
                console.log(' - ROLES');
                roles.cache.map(async role => {
                    console.log('   -', role.id, role.name);
                    // console.log('   -', role);
                    if (db) await knex('ds_roles').insert({
                        guild_id: guild.id,
                        role_id: role.id,
                        name: utf8.encode(role.name),
                        raw_position: role.rawPosition
                    });

                    // const permissions = role.permissions.toArray();
                    const permissions = role.permissions.serialize();
                    // console.log('permissions', permissions);
                    const rolePermissionsInsert = {
                        guild_id: guild.id,
                        role_id: role.id,
                    };
                    for (let permission in permissions) {
                        const permissionValue = permissions[permission];
                        if (permissionValue) {
                            rolePermissionsInsert[permission] = 1;
                            // console.log('     -', permission, permissionValue);
                        }
                    }
                    // console.log('     -', rolePermissionsInsert);
                    if (db) await knex('ds_permissions').insert(rolePermissionsInsert);

                    // role.permissions.cache.map(permission => {
                    //     console.log('     -', permission);
                    // });
                });

            //     console.log(`----------------------`);
            //     console.log(' - CHANNELS');
            //     channels.cache.map(async channel => {
            //         console.log('   -', channel.type.substr(0, 1), channel.id, channel.name);
            //         if (db) await knex('ds_channels').insert({ guild_id: guild.id, channel_id: channel.id, name: utf8.encode(channel.name) });
            //         // channel.permissionOverwrites.map(permission => {
            //         //     if (permission.type === 'role') {
            //         //         const role = roles.cache.get(permission.id);
            //         //         if (role) {
            //         //             // console.log('       ->', 'permission', permission);
            //         //             console.log('       -', role.name);
            //         //             // console.log('         -', 'deny', permission.deny.serialize());
            //         //             // console.log('         -', 'allow', permission.allow);
            //         //         }
            //         //     }
            //         // });
            //     });

            //     // console.log(`----------------------`);
            //     // console.log(' - ROLES');
            //     // roles.cache.map(role => {
            //     //     console.log('   -', role.id, role.name);
            //     // });
        });

    }
}

function toArray(obj) {
    return JSON.parse(JSON.stringify(obj));
}

async function getAllGuilds() {
    const guilds = toArray(
        await knex('ds_guilds')
            .orderBy('name')
            .select('guild_id', 'name')
    );

    console.log('guilds', guilds);

    return {
        guilds,
    };
}

async function getAllGuildRoles(params) {
    const { guild_id } = params;

    const guild = toArray(
        await knex('ds_guilds')
            .where('guild_id', guild_id)
            .orderBy('name')
            .select('guild_id', 'name')
            .first()
    );

    const roles = toArray(
        await knex('ds_guilds')
            .innerJoin('ds_roles', 'ds_guilds.guild_id', 'ds_roles.guild_id')
            .leftJoin('ds_permissions', 'ds_roles.role_id', 'ds_permissions.role_id')
            .where('ds_guilds.guild_id', guild_id)
            .orderBy('ds_roles.raw_position', 'DESC')
            .select(
                'ds_roles.role_id',
                'ds_roles.name',

                'ds_permissions.CREATE_INSTANT_INVITE',
                'ds_permissions.KICK_MEMBERS',
                'ds_permissions.BAN_MEMBERS',
                'ds_permissions.ADMINISTRATOR',
                'ds_permissions.MANAGE_CHANNELS',
                'ds_permissions.MANAGE_GUILD',
                'ds_permissions.ADD_REACTIONS',
                'ds_permissions.VIEW_AUDIT_LOG',
                'ds_permissions.PRIORITY_SPEAKER',
                'ds_permissions.STREAM',
                'ds_permissions.VIEW_CHANNEL',
                'ds_permissions.SEND_MESSAGES',
                'ds_permissions.SEND_TTS_MESSAGES',
                'ds_permissions.MANAGE_MESSAGES',
                'ds_permissions.EMBED_LINKS',
                'ds_permissions.ATTACH_FILES',
                'ds_permissions.READ_MESSAGE_HISTORY',
                'ds_permissions.MENTION_EVERYONE',
                'ds_permissions.USE_EXTERNAL_EMOJIS',
                'ds_permissions.VIEW_GUILD_INSIGHTS',
                'ds_permissions.CONNECT',
                'ds_permissions.SPEAK',
                'ds_permissions.MUTE_MEMBERS',
                'ds_permissions.DEAFEN_MEMBERS',
                'ds_permissions.MOVE_MEMBERS',
                'ds_permissions.USE_VAD',
                'ds_permissions.CHANGE_NICKNAME',
                'ds_permissions.MANAGE_NICKNAMES',
                'ds_permissions.MANAGE_ROLES',
                'ds_permissions.MANAGE_WEBHOOKS',
                'ds_permissions.MANAGE_EMOJIS',
            )
    ).map(role => {
        role.name = utf8.decode(role.name);
        return role;
    });

    return {
        guild,
        roles,
    };
}

module.exports = {

    // getUserFromMention,
    // getChannelFromMention,
    getMessageVars,
    checkIsValidCommand,
    sendMessage,

    reloadDiscordDatabase,
    getAllGuilds,
    getAllGuildRoles,

};