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
        member_avatar: author.avatar,
        member_nickname: isDm ? null : utf8.encode(member.nickname),
        roles: isDm ? null : utf8.encode(JSON.stringify(roles)),
        message_content: messageContent,
    };

    const id = await knex('discord_messages').insert(data);// .toString();
    console.log('id', id);
}

module.exports = {
    getMessageVars,
    sendMessage,
    saveMessage,
};
