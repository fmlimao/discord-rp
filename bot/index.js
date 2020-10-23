console.clear();

require('dotenv-safe').config();

const moment = require('moment');

const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();

const {
    checkIsValidCommand,
    showCommands,

    commandWhitelistStart,
    commandWhitelistAnswer,
    commandStoreShow,
    commandCartShow,
    commandCartAdd,
    commandCartRemove,
    commandCartPay
} = require('./src/managers/user-actions');

const commands = {
    'wl': {
        command: '^!wl$',
        title: '!wl',
        description: 'Iniciar o questionário de whitelist',
        callback: commandWhitelistStart,
    },
    'wl-id': {
        command: '^!wl ([A-z0-9\s]+)$',
        title: '!wl [resposta]',
        description: 'Responder pergunta da whitelist',
        callback: commandWhitelistAnswer,
    },
    'loja': {
        command: 'loja',
        title: '!loja',
        description: 'Exibir os itens da nossa loja',
        callback: commandStoreShow,
    },
    'carrinho': {
        command: 'carrinho',
        title: '!carrinho',
        description: 'Ver o seu carrinho de compras',
        callback: commandCartShow,
    },
    'carrinho-id': {
        command: 'carrinho (\\d+)',
        title: '!carrinho [código do produto]',
        description: 'Adicionar um item no seu carrinho',
        callback: commandCartAdd,
    },
    'carrinho-remover-id': {
        command: 'carrinho remover (\\d+)',
        title: '!carrinho remover [código do produto]',
        description: 'Remover um item no seu carrinho',
        callback: commandCartRemove,
    },
    'carrinho-pagar': {
        command: 'carrinho pagar',
        title: '!carrinho pagar',
        description: 'Finalizar sua compra',
        callback: commandCartPay,
    },
};

client.on('ready', () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');
    client.user.setActivity(`${date}`);

    // console.log(`Bot iniciado em ${date}`);
    // console.log(` - TAG: ${client.user.tag}`);
    // console.log(` - ID: ${client.user.id}`);
    // console.log(` - USERNAME: ${client.user.username}`);
    // console.log(`----------------------`);

    console.log(' - BOT:', client.user.id, client.user.username);

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

    console.log(`----------------------`);
});

client.on('message', async message => {

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
    const isValidCommand = isCommand && checkIsValidCommand(message, commands, messageContent);

    if (isBot) return;

    // log simples da mensagem
    if (author) console.log('author:', author.id, author.username);
    if (channel) console.log('channel:', channel.type, channel.id, channel.name);
    if (guild) console.log('guild:', guild.id, guild.name);
    console.log('messageContent:', messageContent);
    console.log('mentions:', messageMentions.users.size);
    messageMentions.users.map(user => { console.log(`  - mention: ${user.id} ${user.username}`); });
    // message.member.roles.cache.map(role => { console.log('role:', role.id, role.name); });
    console.log('messageCommand', messageCommand);
    console.log('isValidCommand', isValidCommand);
    console.log(`----------------------`);

    // mensagens privadas
    if (!isBot && isDm) {

        if (!isValidCommand) {
            return showCommands(message, commands);
        }

        return await commands[isValidCommand].callback(message, messageContent, messageCommand, messageArgs);
    }

    // canal WHITELIST
    if (!isBot && channel.id === process.env.BOT_CHANNEL_WHITELIST) {

        if (isValidCommand === 'wl') {
            return await commands['wl'].callback(message, messageContent, messageCommand, messageArgs);
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
