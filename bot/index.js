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
        isTextChannel,
        isCommand,
        isValidCommand,
        // author,
        channel,
        // guild,
        messageContent,
        // messageMentions,
        // messageContentWithoutPrefix,
        // messageContentSplit,
        // messageCommand,
        // messageArgs,
    } = getMessageVars(message, commands);

    if (isBot) return;

    // log simples da mensagem
    // console.log(`----------------------`);
    // console.log('Mensagem de Usuário:', messageContent);
    // if (author) console.log(' - author:', author.id, author.username);
    // if (channel) console.log(' - channel:', channel.type, channel.id, channel.name);
    // if (guild) console.log(' - guild:', guild.id, guild.name);
    // console.log(' - isDm', isDm);
    // console.log(' - isTextChannel', isTextChannel);
    // console.log(' - isCommand', isCommand);
    // console.log(' - isValidCommand', isValidCommand);
    // console.log('messageContent:', messageContent);
    // console.log('mentions:', messageMentions.users.size);
    // messageMentions.users.map(user => { console.log(`  - mention: ${user.id} ${user.username}`); });
    // // message.member.roles.cache.map(role => { console.log('role:', role.id, role.name); });
    // console.log('messageCommand', messageCommand);
    // console.log('isValidCommand', isValidCommand);
    // console.log(`----------------------`);

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










    // canal LOJA
    // if (!isBot && channel.id === process.env.BOT_CHANNEL_STORE) {
    //     if (isCommand && command === 'iniciar') {
    //         message.content = '';
    //         userWhitelistManager(message);
    //     }

    //     message.delete();
    //     return;
    // }











    return;

    // // verificando se o usuario está escrevendo em
    // // um canal de whitelist
    // const channelWhitelist = await knex('wl_users')
    //     .where('wl_users.deleted_at', null)
    //     .where('wl_users.active', 1)
    //     .where('wl_users.channel_id', message.channel.id)
    //     .select('wl_users.user_id', 'wl_users.channel_id', 'wl_users.channel_name')
    //     .first();
    // if (channelWhitelist) {
    //     // Se este canal não for deste usuario, apago a mensagem
    //     if (channelWhitelist.user_id !== message.author.id) {
    //         message.delete();
    //         return;
    //     } else {

    //     }
    // }

    // // log simples da mensagem

    // if (message.author) {
    //     console.log('author:', message.author.id, message.author.username);
    // }

    // if (message.channel) {
    //     console.log('channel:', message.channel.type, message.channel.id, message.channel.name);

    //     if (message.channel.guild) {
    //         console.log('guild:', message.channel.guild.id, message.channel.guild.name);
    //     }
    // }

    // console.log('content:', message.content);

    // console.log('mentions:', message.mentions.users.size);
    // message.mentions.users.map(user => {
    //     console.log(`  - mention: ${user.id} ${user.username}`);
    // });

    // // console.log('message:', message);

    // console.log(`----------------------`);

    // // se for um comando, segue abaixo
    // if (message.content.substr(0, 1) === process.env.BOT_PREFIX) {

    // }

    // const content = message.content;
    // const withoutPrefix = message.content.slice(process.env.BOT_PREFIX.length);
    // const split = withoutPrefix.split(/ +/);
    // const command = split[0];
    // const args = split.slice(1);
    // console.log('content', content);
    // console.log('command', command, args);

    // // apagar mensagens
    // // fetched = await message.channel.messages.fetch({ limit: 100 });
    // // message.channel.bulkDelete(fetched);

    // // exibir lista de comandos
    // if (command === 'whitelist') {
    //     // const channelWhitelist = await knex('wl_users')
    //     //     .where('wl_users.deleted_at', null)
    //     //     .where('wl_users.active', 1)
    //     //     .where('wl_users.channel_id', message.channel.id)
    //     //     .select('wl_users.user_id', 'wl_users.channel_id', 'wl_users.channel_name')
    //     //     .first();
    //     // console.log('channelWhitelist', channelWhitelist);

    //     // if (channelWhitelist) {
    //     //     message.channel.cache.get(message.channel.id).send(`Este é o seu canal de WHITELIST. Responda as perguntas abaixo conforme elas forem aparecendo.`);
    //     //     return;
    //     // }

    //     const user = await knex('wl_users')
    //         .where('wl_users.deleted_at', null)
    //         .where('wl_users.active', 1)
    //         .where('wl_users.user_id', message.author.id)
    //         .select('wl_users.user_id', 'wl_users.channel_id', 'wl_users.channel_name')
    //         .first();

    //     // se nao tem o usuario na whitelist,
    //     // criaremos um canal para ele se cadastrar
    //     if (!user) {
    //         let channelName = null;
    //         let channelExists = null;
    //         let counter = 0;

    //         do {
    //             counter++;

    //             channelName = `wl-${slug(message.author.username)}`;
    //             if (counter > 1) channelName += `-${counter}`;
    //             channelExists = message.guild.channels.cache.findKey(channel => channel.name === channelName);
    //         } while (channelExists);

    //         message.guild.channels.create(channelName, {
    //             type: 'text',
    //             parent: process.env.BOT_CHANNEL_PARENT_WHITELIST,
    //         })
    //             .then(async channel => {
    //                 console.log('new channel', channel.id, channel.name);

    //                 channel.send(`Aqui é o canal do questionário.`);

    //                 await knex('wl_users').insert({
    //                     user_id: message.author.id,
    //                     channel_id: channel.id,
    //                     channel_name: channel.name,
    //                 });
    //             })
    //             .catch(console.error);

    //     } else {
    //         console.log('ja tem registro');
    //     }
    // }

});

client.login(process.env.BOT_TOKEN);


const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
// const io = require('socket.io')(http);

app.use('/assets', express.static(path.join(__dirname, './public')));

// io.on('connection', (socket) => {
//     // console.log('----------------------');
//     console.log('=> SOCKET: Um usuário se conectou');

//     socket.on('disconnect', () => {
//         console.log('=> SOCKET: Um usuário desconectou');
//     });

//     // socket.on('get-whitelist-answers', async () => {
//     //     console.log('=> SOCKET: Um usuário quer as respostas do whitelist');

//     //     socket.emit('get-whitelist-answers', await getAllUsersAnswers());
//     // });

//     socket.on('get-guilds', async params => {
//         console.log('=> SOCKET: get-guilds', params);
//         socket.emit('get-guilds', await getAllGuilds());
//     });

//     socket.on('get-guild-roles', async params => {
//         console.log('=> SOCKET: get-guild-roles', params);
//         socket.emit('get-guild-roles', await getAllGuildRoles(params));
//     });

//     // socket.on('set-guild-role-permission', async params => {
//     //     console.log('=> SOCKET: set-guild-role-permission', params);
//     //     const { guild_id, role_id, permission, value } = params;
//     //     // socket.emit('get-guild-roles', await getAllGuildRoles(params));

//     //     const guild = client.guilds.cache.get(guild_id);
//     //     const role = guild.roles.cache.get(role_id);

//     //     // role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS']);
//     //     console.log('role', role);
//     // });
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html');
});

app.use((req, res, next) => {
    req.ret = {
        code: 200,
        error: false,
        messages: [],
        form: {},
        content: {},
    };

    next();
});

app.get('/api/update-server', (req, res) => {
    const ret = req.ret;
    res.status(ret.code).json(ret);
});

// app.get('/whitelist/answers', (req, res) => {
//     res.sendFile(__dirname + '/src/views/whitelist/answers.html');
// });

// app.get('/guilds', (req, res) => {
//     res.sendFile(__dirname + '/src/views/guilds-list.html');
// });

// app.get('/guilds/:guild_id/roles', (req, res) => {
//     const { guild_id } = req.params;
//     res.sendFile(__dirname + '/src/views/guilds-id-roles.html');
// });

http.listen(process.env.API_PORT, () => {
    // console.log('----------------------');
    console.log(`=> API: Servidor iniciado na porta ${process.env.API_PORT}`);
});
