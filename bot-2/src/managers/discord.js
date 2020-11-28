const { MessageEmbed } = require('discord.js');

function getMessageVars(message) {
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

module.exports = {
    getMessageVars,
    sendMessage,
};
