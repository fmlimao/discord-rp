const { MessageEmbed } = require('discord.js');

const { getMessageVars } = require('./managers/discord');

const whitelistManager = require('./managers/whitelist');
const storeManager = require('./managers/store');

const commands = {
    'wl': {
        command: '^!wl$',
        title: '!wl',
        description: 'Iniciar o questionário de whitelist',
        callback: commandWhitelistStart,
    },
    'wl-id': {
        command: '^!wl (.*)$',
        title: '!wl [resposta]',
        description: 'Responder pergunta da whitelist',
        callback: commandWhitelistAnswer,
    },
    'loja': {
        command: '^!loja$',
        title: '!loja',
        description: 'Exibir os itens da nossa loja',
        callback: commandStoreShow,
    },
    // 'carrinho': {
    //     command: 'carrinho',
    //     title: '!carrinho',
    //     description: 'Ver o seu carrinho de compras',
    //     callback: commandCartShow,
    // },
    // 'carrinho-id': {
    //     command: 'carrinho (\\d+)',
    //     title: '!carrinho [código do produto]',
    //     description: 'Adicionar um item no seu carrinho',
    //     callback: commandCartAdd,
    // },
    // 'carrinho-remover-id': {
    //     command: 'carrinho remover (\\d+)',
    //     title: '!carrinho remover [código do produto]',
    //     description: 'Remover um item no seu carrinho',
    //     callback: commandCartRemove,
    // },
    // 'carrinho-pagar': {
    //     command: 'carrinho pagar',
    //     title: '!carrinho pagar',
    //     description: 'Finalizar sua compra',
    //     callback: commandCartPay,
    // },
};

function showCommands(message) {
    const response = new MessageEmbed()
        .setTitle(`Lista de Comandos`)
        .setColor(0x0099ff);

    for (let commandId in commands) {
        const command = commands[commandId];
        response.addField('`' + command.title + '`', command.description);
    }

    message.author.send(response);
}

async function callCommand(message) {
    const {
        isValidCommand,
        messageCommand,
        messageContent,
        messageArgs,
    } = getMessageVars(message, commands);

    return await commands[isValidCommand].callback(message, messageContent, messageCommand, messageArgs);
}

async function commandWhitelistStart(message, messageContent, messageCommand, messageArgs) {
    console.log('=> BOT: - commandWhitelistStart()', messageContent);

    whitelistManager.start(message, messageContent, messageCommand, messageArgs);
}

async function commandWhitelistAnswer(message, messageContent, messageCommand, messageArgs) {
    console.log('=> BOT: - commandWhitelistAnswer()', messageContent);

    whitelistManager.setAnswer(message, messageContent, messageCommand, messageArgs);

}

async function commandStoreShow(message, messageContent, messageCommand, messageArgs) {
    console.log('=> BOT: - commandStoreShow()', messageContent);

    storeManager.showProducts(message);
}

// async function commandCartShow(message, messageContent, messageCommand, messageArgs) {
//     console.log('=> BOT: - commandCartShow()', messageContent);
// }

// async function commandCartAdd(message, messageContent, messageCommand, messageArgs) {
//     console.log('=> BOT: - commandCartAdd()', messageContent);
// }

// async function commandCartRemove(message, messageContent, messageCommand, messageArgs) {
//     console.log('=> BOT: - commandCartRemove()', messageContent);
// }

// async function commandCartPay(message, messageContent, messageCommand, messageArgs) {
//     console.log('=> BOT: - commandCartPay()', messageContent);
// }

module.exports = {
    commands,

    showCommands,
    callCommand,

    // commandWhitelistStart,
    // commandWhitelistAnswer,
    // commandStoreShow,
    // commandCartShow,
    // commandCartAdd,
    // commandCartRemove,
    // commandCartPay,
};