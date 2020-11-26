console.clear();

require('dotenv-safe').config();

const moment = require('moment');

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const { getMessageVars, sendMessage } = require('./src/managers/discord');
const { commands, showCommands, callCommand } = require('./src/commands');
const WhitelistManager = require('./src/managers/whitelist');

client.on('ready', () => {
    const date = moment().format('DD/MM/YYYY HH:mm:ss');
    // client.user.setActivity(`${date}`);
    client.user.setActivity(``);

    console.log(`=> Bot iniciado em ${date}`);
    console.log(` - TAG: ${client.user.tag}`);
    console.log(` - ID: ${client.user.id}`);
    console.log(` - USERNAME: ${client.user.username}`);
    console.log(`----------------------`);

    // console.log(`----------------------`);
    // console.log('=> BOT: Bot iniciado');

    const guild = client.guilds.cache.get(process.env.DS_GUILD);
    console.log(' - GUILD ID:', guild.id);
    console.log(' - GUILD NAME:', guild.name);
    console.log(`----------------------`);

    // console.log(' - CHANNELS');
    // guild.channels.cache.map(channel => {
    //     console.log('   -', channel.type.substr(0, 1), channel.id, channel.name);
    // });

    // console.log(' - ROLES');
    // guild.roles.cache.map(role => {
    //     console.log('   -', role.id, role.name);
    // });

    // console.log(`----------------------`);
    // console.log(' - CHANNELS');
    // client.guilds.cache.map(guild => {
    //     console.log('   -', guild.id, guild.name);
    // });



    // const guild = client.guilds.cache.get('765566693967527957');
    // console.log('guild', guild.name);

    // const role = guild.roles.cache.get('765599583345573898');
    // console.log('role', role.id, role.name);

    // role.setPermissions(['KICK_MEMBERS', 'BAN_MEMBERS']);


    // reloadDiscordDatabase(client);
});

client.on('message', async message => {
    const {
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
        isValidCommand,
    } = getMessageVars(message, commands);

    const isCreator = message.member.roles.cache.has(process.env.DS_ROLE_CREATOR);
    const isWhitelist = message.member.roles.cache.has(process.env.DS_ROLE_WHITELIST);

    if (isBot) return;

    if (isDm) return;

    if (guild.id != process.env.DS_GUILD) return;

    // console.log(message.member.roles.has(process.env.DS_ROLE_CREATOR));

    // comandos de debug
    if (messageCommand == 'debug') {
        console.log('=> COMMAND: !debug');
        console.log(' - author:', author.id, author.username);
        console.log(' - isCreator:', isCreator);
        console.log(' - channel:', channel.id, channel.name);
        console.log(' - channel parentID:', channel.parentID);
        console.log(' - messageContent:', messageContent);
        console.log(' - isCommand:', isCommand);
        console.log(' - messageCommand:', messageCommand);
        console.log(' - messageArgs:', messageArgs);
        console.log(' - messageMentions:', messageMentions);
        console.log('-----------------------');
        message.delete();
        return;
    }

    if (messageCommand == 'jobs') {
        console.log('=> COMMAND: !debug');

        (new Promise((resolve) => {
            let ret = [];

            const size = message.channel.guild.roles.cache.size;
            let count = 0;

            message.channel.guild.roles.cache.map(role => {
                ret.push(role);
                count++;

                if (size == count) return resolve(ret);
            });

        })).then(roles => {
            roles.sort((a, b) => {
                if (a.rawPosition < b.rawPosition) return 1;
                if (a.rawPosition > b.rawPosition) return -1;
                return 0;
            });

            for (let i in roles) {
                const role = roles[i];
                console.log(' -', role.id, role.name);
            }

            console.log('-----------------------');
        });

        message.delete();
        return;
    }

    if (isCreator && messageCommand === 'clear') {
        console.log('=> COMMAND: !clear');
        console.log('-----------------------');
        fetched = await message.channel.messages.fetch({ limit: 100 });
        message.channel.bulkDelete(fetched);

        if (channel.id == process.env.DS_CHANNEL_WHITELIST) {
            setTimeout(function () {
                sendMessage(message.channel, 'WHITELIST', `Neste canal você pode iniciar o seu questionário da Whitelist.

                Para isso, basta copiar e inserir o comando \`!iniciar\`, assim criaremos um canal exclusivo para você continuar o processo.

                ***As Whitelists que não forem terminadas em 6 horas serão excluídas, mas poderão ser iniciadas novamente =).***`, 0x00ff00);
            }, 2000);
        }

        return;
    }

    if (messageCommand === 'reset') {
        console.log('=> COMMAND: !reset');
        console.log('-----------------------');

        WhitelistManager.reset(message, messageContent, messageCommand, messageArgs)
            .then(msg => {
                msg.delete();
            });

        return;
    }

    // canal WHITELIST
    if (channel.id == process.env.DS_CHANNEL_WHITELIST) {

        if (isWhitelist) {
            // sendMessage(message.channel, 'WHITELIST', `Olá ${message.author.username}, você já esta liberado em nossa Whitelist =)`, 0x0000ff);

            message.delete();
            return;
        }

        if (messageCommand === 'iniciar') {
            console.log('=> COMMAND: !iniciar');
            console.log('-----------------------');

            WhitelistManager.start(message, messageContent, messageCommand, messageArgs)
                .then(msg => {
                    msg.delete();
                });

            return;
        }

        message.delete();
        return;
    }



    // canal de resposta de WHITELIST
    if (channel.name == '⬜🔹ʀᴇꜱᴘᴏɴᴅᴇʀ-ᴀqᴜɪ') {
        if (messageCommand === 'delete') {
            console.log('message.channel', message.channel.id, message.channel.name);
            message.channel.delete();
            return;
        }

        WhitelistManager.setAnswer(message, messageContent, messageCommand, messageArgs);
    }

    // canal de resposta de WHITELIST
    if (channel.name.indexOf('⬜🔹ʀᴇꜱᴘᴏꜱᴛᴀꜱ') !== -1) {
        if (messageCommand === 'liberar') {
            console.log('=> COMMAND: !liberar');
            console.log('-----------------------');

            WhitelistManager.release(message, messageContent, messageCommand, messageArgs)
                .then(msg => {
                    msg.delete();
                });

            return;
        }

        // message.delete();
        return;
    }




    // canal BOT CONFIG
    if (channel.id == process.env.DS_CHANNEL_BOT_CONFIG) {

        if (messageCommand === 'limpar-whitelist') {
            console.log('=> COMMAND: !limpar-whitelist');
            console.log('-----------------------');

            WhitelistManager.clear(message, messageContent, messageCommand, messageArgs)
                .then(msg => {
                    msg.delete();
                });

            return;
        }

        message.delete();
        return;
    }



















});

client.login(process.env.BOT_TOKEN);
