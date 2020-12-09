console.clear();

require('dotenv-safe').config();
const knex = require('./src/database/connection');

const moment = require('moment');

const { Client } = require('discord.js');
const client = new Client();

const {
    getMessageVars,
    sendMessage,
    sendEmbedMessage,

    insertGuild,
    deleteGuild,
    updateGuild,

    insertGuildRole,
    deleteGuildRole,
    updateGuildRole,

    insertGuildChannel,
    deleteGuildChannel,
    updateGuildChannel,

    // insertGuildConfig,
    // deleteGuildConfig,
    // updateGuildConfig,

    // deleteGuildConfigs,
    updateGuildConfigs,
    getGuildConfigs,
} = require('./src/managers/discord');

let guildsConfigs = {};

client.on('ready', async () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');

    console.log(`=> Bot iniciado em ${date}`);
    console.log(` - TAG: ${client.user.tag}`);
    console.log(` - ID: ${client.user.id}`);
    console.log(` - USERNAME: ${client.user.username}`);
    console.log(`----------------------`);

    guildsConfigs = await getGuildConfigs();

    console.log('guildsConfigs', guildsConfigs);
    console.log(`----------------------`);

});

client.on('message', async message => {
    const {
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
    } = getMessageVars(message);

    if (isBot) return;

    if (isDm) return;

    const prefix = guildsConfigs[guild.id].prefix;

    if (!message.content.startsWith(prefix)) return;

    // console.log('isBot', isBot);
    // console.log('isDm', isDm);
    // console.log('isTextChannel', isTextChannel);
    // console.log('isCommand', isCommand);
    // console.log('author', author.username);
    // console.log('member', member.nickname);
    // console.log('channel', channel.name);
    // console.log('guild', guild.id, guild.name);
    // console.log('prefix', prefix);
    // console.log('messageContent', messageContent);
    // console.log('messageMentions', messageMentions);
    // console.log('messageCommand', messageCommand);
    // console.log('messageArgs', messageArgs);
    // console.log(`----------------------`);

    if (messageCommand === '!adv') {

        if (messageArgs.length === 0) {
            return sendEmbedMessage(message.channel, 'Comando `!adv`', `*Aplicar adivertência em um player*

            \`!adv\` @player <motivo>`);
        }

        const member = messageArgs[0] && messageArgs[0].hasUser ? messageArgs[0].hasUser.id : false;

        if (!member) {
            return sendEmbedMessage(message.channel, 'Comando `!adv`', `Player não encontrado!

            \`!adv\` @player <motivo>`, 0xff0000);
        }

        const reason = [];
        if (messageArgs.length >=2) {
            for (let i = 1; i < messageArgs.length; i++) {
                if (messageArgs[i].content) {
                    reason.push(messageArgs[i].content);
                }
            }
        }
        // console.log('member', member);
        // console.log('reason', reason.join(' '));
        // console.log(`----------------------`);
    }

    // console.log('message', message);

});

client.on('guildCreate', async guild => {
    console.log(`guildCreate: ${guild.name}`);

    await insertGuild(guild);
});

client.on('guildDelete', async guild => {
    console.log(`guildDelete: ${guild.name}`);

    await deleteGuild(guild);
});

client.on('guildUpdate', async (oldGuild, newGuild) => {
    console.error(`guildUpdate: ${newGuild.name}`);

    await updateGuild(oldGuild, newGuild);
});

client.on('roleCreate', async role => {
    console.error(`roleCreate: ${role.name}`);

    await insertGuildRole(role);
});

client.on('roleDelete', async role => {
    console.error(`roleDelete: ${role.name}`);

    await deleteGuildRole(role);
});

client.on('roleUpdate', async (oldRole, newRole) => {
    console.error(`roleUpdate: ${newRole.name}`);

    await updateGuildRole(oldRole, newRole);
});

client.on('channelCreate', async channel => {
    console.log(`channelCreate: ${channel.name}`);

    await insertGuildChannel(channel);
});

client.on('channelDelete', async channel => {
    console.log(`channelDelete: ${channel.name}`);

    await deleteGuildChannel(channel);
});

client.on('channelUpdate', async (oldChannel, newChannel) => {
    console.log(`channelUpdate: ${newChannel.name}`);

    await updateGuildChannel(oldChannel, newChannel);
});

client.on("userNoteUpdate", function (user, oldNote, newNote) {
    console.log(`a member's note is updated`);
});

client.on("userUpdate", function (oldUser, newUser) {
    console.log(`user's details (e.g. username) are changed`);
});

client.on("voiceStateUpdate", function (oldMember, newMember) {
    console.log(`a user changes voice state`);
});

client.login(process.env.BOT_TOKEN);
