const { MessageEmbed } = require('discord.js');

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

function getMessageVars(message, commands) {
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
        isValidCommand,
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

module.exports = {

    // getUserFromMention,
    // getChannelFromMention,
    getMessageVars,
    checkIsValidCommand,
    sendMessage,

};