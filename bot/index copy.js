console.clear();

const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const config = require('./config.json');

const moment = require('moment');

function getUserFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.users.cache.get(mention);
    }
}

function getChannelFromMention(mention) {
    if (!mention) return;

    if (mention.startsWith('<#') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return client.channels.cache.get(mention);
    }
}

client.on('ready', () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');

    console.log(`Bot iniciado em ${date}`);
    console.log(` - TAG: ${client.user.tag}`);
    console.log(` - ID: ${client.user.id}`);
    console.log(` - USERNAME: ${client.user.username}`);
    console.log(`----------------------`);
    client.user.setActivity(`${date}`);
});

client.on('message', message => {

    // se a mensagem for do proprio bot, ignora
    if (message.author.id == config.bot_id) return;

    // se nao for um comando, ignora
    if (message.content.substr(0, 1) !== config.prefix) return;

    if (message.author) {
        console.log('author', message.author.id, message.author.username);
    }

    if (message.channel) {
        console.log('channel', message.channel.id, message.channel.name);

        if (message.channel.guild) {
            console.log('guild', message.channel.guild.id, message.channel.guild.name);
        }
    }

    console.log('content', message.content);

    console.log('mentions', message.mentions.users.size);
    message.mentions.users.map(user => {
        console.log(`  - mention: ${user.id} ${user.username}`);
    });

    console.log(`----------------------`);

    const content = message.content;
    const withoutPrefix = message.content.slice(config.prefix.length);
    const split = withoutPrefix.split(/ +/);
    const command = split[0];
    const args = split.slice(1);
    console.log('content', content);
    console.log('command', command, args);

    // exibir lista de comandos
    if (command === 'comandos') {

        // TODO: exibir os comandos disponiveis
        console.log('TODO: exibir os comandos disponiveis');

    }

    console.log('message.content', message.content);


    if (command === 'config') {

        if (args[0] === 'channel-config') {}

        for (let i in args) {
            const arg = args[i];

            const user = getUserFromMention(arg);
            const channel = getChannelFromMention(arg);

            console.log(' - arg', arg, user ? user.username : '---', channel ? channel.name : '---');
        }
    }




});

client.login(config.token);
