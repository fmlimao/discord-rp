const { MessageEmbed, MessageAttachment } = require('discord.js');

function showProducts(message) {

    const response = new MessageEmbed()
        .setTitle(`Lista de Comandos`)
        .setColor(0x0099ff)
        .setDescription('TESTE')
        .setImage('https://i.imgur.com/wSTFkRM.png')
    ;

    message.author.send(response);
}

module.exports = {
    showProducts,
};
