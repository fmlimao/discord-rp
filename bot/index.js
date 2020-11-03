console.clear();

require('dotenv-safe').config();

const moment = require('moment');

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const { getMessageVars, reloadDiscordDatabase, getAllGuilds, getAllGuildRoles } = require('./src/managers/discord');
const { commands, showCommands, callCommand } = require('./src/commands');
// const { getAllUsersAnswers } = require('./src/managers/whitelist');

client.on('ready', () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');
    client.user.setActivity(`${date}`);

    // console.log(`Bot iniciado em ${date}`);
    // console.log(` - TAG: ${client.user.tag}`);
    // console.log(` - ID: ${client.user.id}`);
    // console.log(` - USERNAME: ${client.user.username}`);
    // console.log(`----------------------`);

    // console.log(`----------------------`);
    console.log('=> BOT: Bot iniciado');

    // const guild = client.guilds.cache.get('765566693967527957');
    // console.log(' - GUILD:', guild.id, guild.name);

    // console.log(' - CHANNELS');
    // guild.channels.cache.map(channel => {
    //     console.log('   -', channel.type.substr(0, 1), channel.id, channel.name);
    // });

    // console.log(' - ROLES');
    // guild.roles.cache.map(role => {
    //     console.log('   -', role.id, role.name);
    // });

    // console.log(`----------------------`);



    // const guild = client.guilds.cache.get('765566693967527957');
    // console.log('guild', guild.name);

    // const role = guild.roles.cache.get('765599583345573898');
    // console.log('role', role.id, role.name);

    // role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS']);


    reloadDiscordDatabase(client);




});

client.on('message', async message => {
    const {
        isBot,
        isDm,
        isValidCommand,
        channel
    } = getMessageVars(message, commands);

    if (isBot) return;

    // mensagens privadas
    if (!isBot && isDm) {

        // Apenas pode usar comandos,
        // mas pode usar qualquer comando

        // Se a mensagem nao for um comando válido...
        if (!isValidCommand) {
            // Exibo todos os comandos
            return showCommands(message);
        }

        // Executo o callback do comando
        return await callCommand(message);
    }

    // canal WHITELIST
    if (!isBot && channel.id === process.env.BOT_CHANNEL_WHITELIST) {

        if (isValidCommand === 'wl') {
            return await callCommand(message);
        }

        message.delete();
        return;
    }

    return;

    // // apagar mensagens
    // // fetched = await message.channel.messages.fetch({ limit: 100 });
    // // message.channel.bulkDelete(fetched);


});

client.login(process.env.BOT_TOKEN);
