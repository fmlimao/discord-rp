const utf8 = require('utf8');
const knex = require('../database/connection');
const { MessageEmbed } = require('discord.js');

function getMessageVars(message) {
    const isBot = message.author.id == process.env.BOT_ID;
    const isDm = message.channel.type === 'dm';
    const isTextChannel = message.channel.type === 'text';
    const isCommand = message.content.substr(0, 1) === process.env.BOT_PREFIX;

    const author = message.author;
    const member = message.member;
    const channel = message.channel;
    const guild = message.channel.guild;

    const messageContent = message.content;
    const messageMentions = message.mentions;
    const messageContentWithoutPrefix = messageContent.slice(process.env.BOT_PREFIX.length);
    const messageContentSplit = messageContentWithoutPrefix.split(/ +/);
    const messageCommand = messageContentSplit[0];
    const messageArgs = messageContentSplit.slice(1);

    return {
        isBot,
        isDm,
        isTextChannel,
        isCommand,
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

function sendMessage(to, title, body, color) {
    // const response = new MessageEmbed()
    //     .setTitle(title)
    //     .setColor(color)
    //     .setDescription(`${body}`);
    // to.send(response);
    to.send(body);
}

async function saveMessage(message) {
    const {
        isBot,
        isDm,
        isTextChannel,
        isCommand,
        author,
        member,
        channel,
        guild,
        messageContent,
        messageMentions,
        messageCommand,
        messageArgs,
    } = getMessageVars(message);

    let roles = '';
    if (!isDm) {
        roles = await member.roles.cache.map(role => {
            return {
                id: role.id,
                name: role.name,
                rawPosition: role.rawPosition,
            };
        });
    }

    const data = {
        is_bot: isBot ? 1 : 0,
        is_dm: isDm ? 1 : 0,
        is_text_channel: isTextChannel ? 1 : 0,
        guild_id: isDm ? null : guild.id,
        guild_name: isDm ? null : utf8.encode(guild.name),
        channel_id: isDm ? null : channel.id,
        channel_name: isDm ? null : utf8.encode(channel.name),
        member_id: author.id,
        member_username: utf8.encode(author.username),
        member_avatar: author.avatarURL(),
        member_nickname: isDm ? null : utf8.encode(member.nickname),
        roles: isDm ? null : utf8.encode(JSON.stringify(roles)),
        message_content: messageContent,
    };

    const id = await knex('discord_messages').insert(data);// .toString();
    console.log('id', id);
}

async function analyzeMessages() {
    return new Promise(async (resolve, reject) => {
        console.log('analyzeMessages()');

        const messages = (await knex.raw('SELECT * FROM discord_messages ORDER BY message_id LIMIT 100;'))[0];

        const guilds = {};

        const messagesId = [];

        const deletes = [];
        const inserts = [];

        for (let i in messages) {
            const message = messages[i];

            messagesId.push(message.message_id);

            const is_bot = message.is_bot;
            const is_dm = message.is_dm;
            const is_text_channel = message.is_text_channel;
            const guild_id = message.guild_id;
            const guild_name = message.guild_name;
            const channel_id = message.channel_id;
            const channel_name = message.channel_name;
            const member_id = message.member_id;
            const member_username = message.member_username;
            const member_avatar = message.member_avatar;
            const member_nickname = message.member_nickname;
            const roles = message.roles;

            if (!is_dm) {

                if (guild_id) {
                    if (typeof guilds[guild_id] === 'undefined') {
                        guilds[guild_id] = {
                            guild_id: guild_id,
                            guild_name: guild_name,
                            channels: {},
                            members: {},
                        };
                    } else {
                        guilds[guild_id]['guild_id'] = guild_id;
                        guilds[guild_id]['guild_name'] = guild_name;
                    }

                    if (channel_id) {
                        if (typeof guilds[guild_id]['channels'][channel_id] === 'undefined') {
                            guilds[guild_id]['channels'][channel_id] = {
                                channel_id: channel_id,
                                channel_name: channel_name,
                            };
                        } else {
                            guilds[guild_id]['channels'][channel_id]['channel_id'] = channel_id;
                            guilds[guild_id]['channels'][channel_id]['channel_name'] = channel_name;
                        }
                    }

                    if (member_id) {
                        let member_avatar_url = '';
                        if (member_avatar) {
                            const isUrl = member_avatar.indexOf('http');
                            member_avatar_url = isUrl == -1 ? `https://cdn.discordapp.com/avatars/${member_id}/${member_avatar}.webp` : member_avatar;
                        }

                        if (typeof guilds[guild_id]['members'][member_id] === 'undefined') {
                            guilds[guild_id]['members'][member_id] = {
                                member_id: member_id,
                                member_username: member_username,
                                member_avatar: member_avatar_url,
                                member_nickname: member_nickname,
                                roles: roles,
                            };
                        } else {
                            guilds[guild_id]['members'][member_id]['member_id'] = member_id;
                            guilds[guild_id]['members'][member_id]['member_username'] = member_username;
                            guilds[guild_id]['members'][member_id]['member_avatar'] = member_avatar_url;
                            guilds[guild_id]['members'][member_id]['member_nickname'] = member_nickname;
                        }
                    }
                }

            }
        }

        for (let guild_id in guilds) {
            const guild = guilds[guild_id];
            // console.log(' - guild:', guild.guild_id, utf8.decode(guild.guild_name));

            deletes.push(`DELETE FROM discord_guilds WHERE guild_id = '${guild.guild_id}'`);
            inserts.push(`INSERT INTO discord_guilds (guild_id, name) VALUES('${guild.guild_id}', '${guild.guild_name}')`);

            for (let channel_id in guild.channels) {
                const channel = guild.channels[channel_id];
                // console.log('   - channel:', channel.channel_id, utf8.decode(channel.channel_name));
                deletes.push(`DELETE FROM discord_guild_channels WHERE guild_id = '${guild.guild_id}' AND channel_id = '${channel.channel_id}'`);
                inserts.push(`INSERT INTO discord_guild_channels (guild_id, channel_id, name) VALUES('${guild.guild_id}', '${channel.channel_id}', '${channel.channel_name}')`);
            }

            for (let member_id in guild.members) {
                const member = guild.members[member_id];
                // console.log('   - member:', member.member_id, utf8.decode(member.member_username), utf8.decode(member.member_nickname));
                deletes.push(`DELETE FROM discord_guild_members WHERE guild_id = '${guild.guild_id}' AND member_id = '${member.member_id}'`);
                inserts.push(`INSERT INTO discord_guild_members (guild_id, member_id, username, avatar, nickname, roles) VALUES('${guild.guild_id}', '${member.member_id}', '${member.member_username}', '${member.member_avatar}', '${member.member_nickname}', '${member.roles}')`);
            }
        }

        console.log(`- DELETES -> INICIO`);
        for (let i in deletes) {
            await knex.raw(deletes[i]);
            // console.log('i:', i);
        }
        console.log(`- DELETES -> FIM`);

        console.log(`- INSERTS -> INICIO`);
        for (let i in inserts) {
            await knex.raw(inserts[i]);
            // console.log('i:', i);
        }
        console.log(`- INSERTS -> FIM`);

        console.log(`- BKP MESSAGES -> INICIO`);
        if (messagesId.length) {
            await knex.raw(`INSERT INTO discord_messages_bkp SELECT * FROM discord_messages WHERE message_id IN (${messagesId.join(', ')})`);
            await knex.raw(`DELETE FROM discord_messages WHERE message_id IN (${messagesId.join(', ')})`);
        }
        console.log(`- BKP MESSAGES -> FIM`);

        console.log(`----------------------`);
        resolve(true);
    });
}

module.exports = {
    getMessageVars,
    sendMessage,
    saveMessage,
    analyzeMessages,
};
