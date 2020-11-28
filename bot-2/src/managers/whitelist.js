const knex = require('../database/connection');
const { getMessageVars, sendMessage } = require('./discord');

async function releaseWhitelist(message) {
    const {
        author,
        messageArgs,
    } = getMessageVars(message);

    // quantidade errada de argumentos
    if (messageArgs.length != 1) {
        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que você não informou o comando correto.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    const playerId = messageArgs[0];
    const playerIdInt = parseInt(playerId);

    // se for um ID inválido
    if (playerId != playerIdInt) {
        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que o ID "${playerId}" é inválido.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    // busco no banco o ID da player
    const player = await knex('vrp_users')
        .where('vrp_users.id', playerId)
        .select('id', 'whitelisted')
        .first();

    console.log('player', player);

    // se o ID não existir
    if (!player) {
        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que o ID "${playerId}" não foi encontrado.`,
            `Verifique se o ID está correto. Precisa ser o ID que aparece na tela do FIVEM quando você se conecta.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    // inserimos ou editamos a whitelist do usuario
    const whitelistExists = await knex('discord_whitelist')
        .where('deleted_at', null)
        .where('player_id', player.id)
        .select('user_id', 'player_id', 'finished_at')
        .first();

    if (whitelistExists) {
        const msg = [
            `Olá ${author.username}!`,
            `Recebemos sua Whitelist, porém parece que o ID "${playerId}" já está liberado.`,
            `Verifique se o ID está correto. Precisa ser o ID que aparece na tela do FIVEM quando você se conecta.`,
            `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
            `Por exemplo \`!liberar 123\``,
        ];
        sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
        return;
    }

    // // se o ID ja estiver liberado
    // if (player.whitelisted == 1) {
    //     const msg = [
    //         `Olá ${author.username}!`,
    //         `Recebemos sua Whitelist, porém parece que o ID "${playerId}" já está liberado.`,
    //         `Verifique se o ID está correto. Precisa ser o ID que aparece na tela do FIVEM quando você se conecta.`,
    //         `Volte ao canal da Whitelist e informe o comando corretamente, seguindo esse modelo: \`!liberar <id>\`.`,
    //         `Por exemplo \`!liberar 123\``,
    //     ];
    //     sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
    //     return;
    // }

    // se tudo deu certo, colocamos a role "whitelist" no usuário
    message.member.roles.add(process.env.DS_ROLE_WHITELIST);

    // e adicionamos o ID no nickname dele
    const nickname = message.member.nickname;
    const username = message.member.user.username;
    const newNickname = nickname ? `${nickname} | ${playerId}` : `${username} | ${playerId}`;
    console.log('newNickname', newNickname);
    message.member.setNickname(newNickname);

    // inserimos ou editamos a whitelist do usuario
    const whitelist = await knex('discord_whitelist')
        .where('deleted_at', null)
        .where('user_id', author.id)
        .select('user_id', 'player_id', 'finished_at')
        .first();

    console.log('whitelist', whitelist);

    if (!whitelist) {
        await knex('discord_whitelist').insert({
            user_id: author.id,
            player_id: player.id,
            finished_at: knex.fn.now(),
        });
    } else {
        if (!whitelist.finished_at) {
            await knex('discord_whitelist')
                .where('deleted_at', null)
                .where('user_id', author.id)
                .update({
                    player_id: player.id,
                    finished_at: knex.fn.now(),
                });
        }
    }

    // libero o ID no banco
    await knex('vrp_users')
        .where('vrp_users.id', playerId)
        .update({
            whitelisted: 1,
        });

    // e avisamos o usuário
    const msg = [
        `Olá ${author.username}!`,
        `Recebemos sua Whitelist, e liberamos o ID "${playerId}".`,
        `Agora você pode visualizar nossos canais. Aproveite para solicitar um emprego ou fazer alguma sugestão nos canais indicados.`,
        `Bom jogo para você, e lembre-se: mantenha um bom RP e seja gentil com todos no servidor =)`,
    ];
    sendMessage(author, '', msg.join('\n\n'), 0x00ff00);
    return;
}

module.exports = {
    releaseWhitelist,
};