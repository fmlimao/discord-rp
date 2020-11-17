const discordManager = require('./discord');
const utf8 = require('utf8');
const knex = require('../database/connection');

function sendMessage(to, body) {
    const title = 'Questionário de Whitelist';
    const color = 0x0000ff;
    discordManager.sendMessage(to, title, body, color);
}

function sendErrorAnswer(to, body) {
    const title = 'Resposta Errada';
    const color = 0xff0000;
    discordManager.sendMessage(to, title, body, color);
}

function sendSuccessMessage(to, body) {
    const title = 'Sucesso!!!';
    const color = 0x00ff00;
    discordManager.sendMessage(to, title, body, color);
}

async function getUserWhitelist(user_id) {
    const userWhitelist = await knex('discord_whitelist')
        .where('discord_whitelist.deleted_at', null)
        .where('discord_whitelist.user_id', user_id)
        .select('discord_whitelist.user_id', 'discord_whitelist.channel_id', 'discord_whitelist.user_name', 'discord_whitelist.user_email', 'discord_whitelist.user_birth', 'discord_whitelist.player_name', 'discord_whitelist.player_id', 'discord_whitelist.finished_at')
        .first();

    return userWhitelist;
}

async function showWhitelistQuestion(message) {
    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    const channel = message.channel.guild.channels.cache.get(userWhitelist.channel_id);

    // solicitar o nome do usuario
    if (!userWhitelist.user_name) {
        return sendMessage(channel, 'Para iniciar o questionário, nos informe o seu nome completo:');
    }

    // solicitar email do usuario
    if (!userWhitelist.user_email) {
        return sendMessage(channel, 'Nos informe o seu e-mail:');
    }

    // solicitar a data de nascimento do usuario
    if (!userWhitelist.user_birth) {
        return sendMessage(channel, 'Nos informe sua data de nascimento:');
    }

    // solicitar id do personagem
    if (!userWhitelist.player_id) {
        return sendMessage(channel, 'Nos informe o seu ID de jogador do nosso servidor:');
    }

    // solicitar nome do personagem
    if (!userWhitelist.player_name) {
        return sendMessage(channel, 'Nos informe o seu nome que terá o seu personagem:');
    }

    // buscando as perguntas e respostas
    const {
        questionsList,
        questionIdWithoutAnswer,
    } = await getUserQuestionsAndAnswers(user_id);

    // se todas as pergutas já foram respondidas, finalizo o processo
    if (!questionIdWithoutAnswer) {
        await knex('discord_whitelist')
            .where('discord_whitelist.deleted_at', null)
            .where('discord_whitelist.user_id', user_id)
            .update({
                finished_at: knex.fn.now(),
            });

        return sendSuccessMessage(channel, 'Parabéns! Você já finalizou o whitelist!!!');
    }

    let msg = `${questionsList[questionIdWithoutAnswer].question_id} - ${questionsList[questionIdWithoutAnswer].description}\n`;

    if (questionsList[questionIdWithoutAnswer].type === 'options') {
        for (let i in questionsList[questionIdWithoutAnswer].answers) {
            msg += `\n    [${questionsList[questionIdWithoutAnswer].answers[i].option}] - ${questionsList[questionIdWithoutAnswer].answers[i].description}`;
        }
    }

    return sendMessage(channel, msg);
}

// async function getUserQuestionsAndAnswers(user_id) {
//     const questionsAndAnswers = await knex('discord_whitelist_questions')
//         .leftJoin('discord_whitelist_question_answers', function () {
//             this.onNull('discord_whitelist_question_answers.deleted_at')
//                 .andOn('discord_whitelist_question_answers.question_id', '=', 'discord_whitelist_questions.question_id')
//         })
//         .leftJoin('discord_whitelist_user_answers', function () {
//             this.onNull('discord_whitelist_user_answers.deleted_at')
//                 .andOn('discord_whitelist_user_answers.question_id', '=', 'discord_whitelist_questions.question_id')
//                 .andOn(knex.raw('discord_whitelist_user_answers.user_id = ?', [user_id]))
//         })
//         .where('discord_whitelist_questions.deleted_at', null)
//         .select(
//             'discord_whitelist_questions.question_id        as discord_whitelist_questions_question_id',
//             'discord_whitelist_questions.type               as discord_whitelist_questions_type',
//             'discord_whitelist_questions.description        as discord_whitelist_questions_description',
//             'discord_whitelist_questions.order              as discord_whitelist_questions_order',
//             'discord_whitelist_question_answers.answer_id   as discord_whitelist_question_answers_answer_id',
//             'discord_whitelist_question_answers.description as discord_whitelist_question_answers_description',
//             'discord_whitelist_question_answers.is_correct  as discord_whitelist_question_answers_is_correct',
//             'discord_whitelist_question_answers.option      as discord_whitelist_question_answers_option',
//             'discord_whitelist_user_answers.answer_id       as discord_whitelist_user_answers_answer_id',
//             'discord_whitelist_user_answers.value           as discord_whitelist_user_answers_value'
//         )
//         .orderBy('discord_whitelist_questions.order', 'discord_whitelist_question_answers.order');

//     const questionsList = {};
//     for (let i in questionsAndAnswers) {
//         const row = questionsAndAnswers[i];

//         if (typeof questionsList[row.discord_whitelist_questions_question_id] == 'undefined') {
//             questionsList[row.discord_whitelist_questions_question_id] = {
//                 question_id: row.discord_whitelist_questions_question_id,
//                 type: row.discord_whitelist_questions_type,
//                 description: row.discord_whitelist_questions_description,
//                 order: row.discord_whitelist_questions_order,
//             };

//             if (row.discord_whitelist_questions_type === 'options') {
//                 questionsList[row.discord_whitelist_questions_question_id].userAnswer = row.discord_whitelist_user_answers_answer_id;
//                 questionsList[row.discord_whitelist_questions_question_id].answers = {};
//             } else {
//                 questionsList[row.discord_whitelist_questions_question_id].userAnswer = row.discord_whitelist_user_answers_value;
//             }
//         }

//         if (row.discord_whitelist_question_answers_answer_id) {
//             if (typeof questionsList[row.discord_whitelist_questions_question_id].answers[row.discord_whitelist_question_answers_answer_id] == 'undefined') {
//                 questionsList[row.discord_whitelist_questions_question_id].answers[row.discord_whitelist_question_answers_answer_id] = {
//                     answer_id: row.discord_whitelist_question_answers_answer_id,
//                     description: row.discord_whitelist_question_answers_description,
//                     is_correct: row.discord_whitelist_question_answers_is_correct,
//                     option: row.discord_whitelist_question_answers_option,
//                 };
//             }
//         }
//     }

//     let questionIdWithoutAnswer = null;
//     for (let i in questionsList) {
//         if (!questionsList[i].userAnswer) {
//             questionIdWithoutAnswer = questionsList[i].question_id;
//             break;
//         }
//     }

//     let minTaxCorrectAnswers = .7;
//     let questionsAmount = 0;
//     let correctAnswersAmount = 0;
//     for (let i in questionsList) {
//         questionsAmount++;

//         if (questionsList[i].userAnswer) {
//             for (let j in questionsList[i].answers) {
//                 if (
//                     questionsList[i].answers[j].option == questionsList[i].userAnswer
//                     && questionsList[i].answers[j].is_correct
//                 ) correctAnswersAmount++;
//             }
//         }
//     }
//     let currentTaxCorrectAnswers = correctAnswersAmount / questionsAmount;

//     return {
//         questionsList,
//         questionIdWithoutAnswer,
//         minTaxCorrectAnswers,
//         currentTaxCorrectAnswers,
//         questionsAmount,
//         correctAnswersAmount,
//     };
// }

// function validateEmail(email) {
//     const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }

// function validateBirth(birth) {
//     const re = /(\d){2}\/(\d){2}\/(\d){4}/;
//     return re.test(birth);
// }

async function createUserChannel(message) {
    const user_id = message.author.id;

    return await message.channel.guild.channels.create('Responda Aqui', {
        type: 'text',
        parent: process.env.DS_CATEGORY_WHITELIST,
        permissionOverwrites: [
            {
                // TODOS
                id: message.channel.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
            },
            {
                // usuario atual
                id: user_id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                // bot
                id: process.env.BOT_ID,
                allow: ['VIEW_CHANNEL'],
            },
        ],
    });
}

function deleteUserChannel(message, userWhitelist) {
    if (userWhitelist && userWhitelist.channel_id) {
        const channel = message.channel.guild.channels.cache.get(userWhitelist.channel_id);
        if (channel) {
            channel.delete();
        }
    }
}

async function createUserWhitelist(message, channel) {
    const user_id = message.author.id;
    const username = message.author.username;
    const avatar = message.author.avatarURL();

    await knex('discord_users').insert({
        user_id: user_id,
        username: utf8.encode(username),
        avatar: avatar,
    });

    await knex('discord_whitelist').insert({
        user_id: user_id,
        channel_id: channel.id,
    });
}

async function deleteUserWhitelist(message, userWhitelist) {
    const user_id = message.author.id;

    if (userWhitelist) {
        await knex('discord_whitelist')
            .where('discord_whitelist.deleted_at', null)
            .where('discord_whitelist.user_id', user_id)
            .delete();

        await knex('discord_whitelist_user_answers')
            .where('discord_whitelist_user_answers.deleted_at', null)
            .where('discord_whitelist_user_answers.user_id', user_id)
            .delete();
    }
}

function enableRoleWhitelist(message) {
    message.member.roles.add(process.env.DS_ROLE_WHITELIST);
    message.member.roles.remove(process.env.DS_ROLE_TESTERS);
}

function disableRoleWhitelist(message) {
    message.member.roles.add(process.env.DS_ROLE_TESTERS);
    message.member.roles.remove(process.env.DS_ROLE_WHITELIST);
}

function reset(message, messageContent, messageCommand, messageArgs) {
    return new Promise(async resolve => {
        const user_id = message.author.id;

        // buscando estagio do whitelist
        const userWhitelist = await getUserWhitelist(user_id);

        // apagando os dados da whitelist do usuario
        deleteUserChannel(message, userWhitelist);
        deleteUserWhitelist(message, userWhitelist);
        disableRoleWhitelist(message);

        return resolve(message);
    });
}

async function start(message, messageContent, messageCommand, messageArgs) {
    /**
     * - se ja iniciou, exibir proxima pergunta no canal de respostas
     * - se nao iniciou
     *   - criar o canal de respostas
     *   - criar o registro da whitelist
     *   - exibir proxima pergunta no canal de respostas
     */

    return new Promise(async resolve => {
        const user_id = message.author.id;
        const username = message.author.username;

        // buscando estagio do whitelist
        const userWhitelist = await getUserWhitelist(user_id);

        if (!userWhitelist) {
            const channel = await createUserChannel(message);

            if (channel) {
                createUserWhitelist(message, channel);
                sendMessage(channel, `Olá \`${username}\`, iremos iniciar um pequeno questionário para te habilitar em nossos servidores. Serão poucas perguntas, para saber se você conhece nossas regras, ou seja, é importante que você leia todo o conteúdo do canal Regras, ok?`);
            }
        }

        await showWhitelistQuestion(message);

        return resolve(message);
    });
}

async function setAnswer(message, messageContent, messageCommand, messageArgs) {
        const user_id = message.author.id;

        // buscando estagio do whitelist
        const userWhitelist = await getUserWhitelist(user_id);
        console.log('userWhitelist', userWhitelist);

        if (!userWhitelist) {
            return sendErrorAnswer(message.channel, 'Você ainda não iniciou o whitelist. Para iniciar, responda com `!wl`.');
        }

    //     // const currentAnswer = messageArgs.join(' ');
    //     const currentAnswer = messageContent.trim();

    //     // solicitar o nome do usuario
    //     if (!userWhitelist.user_name) {
    //         const currentAnswerString = String(currentAnswer);
    //         const max = 100;

    //         if (currentAnswerString.length > max) {
    //             sendErrorAnswer(message.channel, `Sua resposta precisa ter menos de ${max} caracteres`);
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             await knex('discord_whitelist')
    //                 .where('discord_whitelist.deleted_at', null)
    //                 .where('discord_whitelist.user_id', user_id)
    //                 .update({
    //                     user_name: currentAnswer,
    //                 });

    //             return await showWhitelistQuestion(message);
    //         }
    //     }

    //     // solicitar email do usuario
    //     if (!userWhitelist.user_email) {
    //         if (!validateEmail(currentAnswer)) {
    //             sendErrorAnswer(message.channel, `E-mail inválido!`);
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             await knex('discord_whitelist')
    //                 .where('discord_whitelist.deleted_at', null)
    //                 .where('discord_whitelist.user_id', user_id)
    //                 .update({
    //                     user_email: currentAnswer,
    //                 });

    //             return await showWhitelistQuestion(message);
    //         }
    //     }

    //     // solicitar a data de nascimento do usuario
    //     if (!userWhitelist.user_birth) {
    //         if (!validateBirth(currentAnswer)) {
    //             sendErrorAnswer(message.channel, `Data inválida!`);
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             await knex('discord_whitelist')
    //                 .where('discord_whitelist.deleted_at', null)
    //                 .where('discord_whitelist.user_id', user_id)
    //                 .update({
    //                     user_birth: currentAnswer.split('/').reverse().join('-'),
    //                 });

    //             return await showWhitelistQuestion(message);
    //         }
    //     }

    //     // e não tem o player_id, recebemos ele
    //     if (!userWhitelist.player_id) {

    //         // analisar resposta do usuário
    //         const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

    //         if (currentAnswer !== currentAnswerClean) {
    //             sendErrorAnswer(message.channel, 'Player ID inválido!');
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             await knex('discord_whitelist')
    //                 .where('discord_whitelist.deleted_at', null)
    //                 .where('discord_whitelist.user_id', user_id)
    //                 .update({
    //                     player_id: currentAnswer,
    //                 });

    //             return await showWhitelistQuestion(message);
    //         }
    //     }

    //     // solicitar nome do personagem
    //     if (!userWhitelist.player_name) {
    //         const currentAnswerString = String(currentAnswer);
    //         const max = 100;

    //         if (currentAnswerString.length > max) {
    //             sendErrorAnswer(message.channel, `Sua resposta precisa ter menos de ${max} caracteres`);
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             await knex('discord_whitelist')
    //                 .where('discord_whitelist.deleted_at', null)
    //                 .where('discord_whitelist.user_id', user_id)
    //                 .update({
    //                     player_name: currentAnswer,
    //                 });

    //             return await showWhitelistQuestion(message);
    //         }
    //     }

    //     // se já tiver o player_id...

    //     // buscando as perguntas e respostas
    //     const {
    //         questionsList,
    //         questionIdWithoutAnswer,
    //         minTaxCorrectAnswers,
    //         currentTaxCorrectAnswers,
    //         questionsAmount,
    //         correctAnswersAmount,
    //     } = await getUserQuestionsAndAnswers(user_id);

    //     // se todas as pergutas já foram respondidas, aviso o usuário
    //     if (!questionIdWithoutAnswer) {
    //         return sendSuccessMessage(message.channel, 'Parabéns! Você já finalizou o whitelist!!!');
    //     }

    //     const answerInsertOption = {
    //         user_id: user_id,
    //         question_id: questionsList[questionIdWithoutAnswer].question_id,
    //     };

    //     if (questionsList[questionIdWithoutAnswer].type === 'options') {
    //         const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

    //         if (currentAnswer !== currentAnswerClean) {
    //             sendErrorAnswer(message.channel, 'Sua resposta precisa ser uma das listadas acima!');
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             let isValidAnswer = false;
    //             for (let i in questionsList[questionIdWithoutAnswer].answers) {
    //                 if (questionsList[questionIdWithoutAnswer].answers[i].option == currentAnswer) {
    //                     isValidAnswer = true;
    //                 }
    //             }

    //             if (!isValidAnswer) {
    //                 sendErrorAnswer(message.channel, 'Sua resposta precisa ser uma das listadas acima!');
    //                 return await showWhitelistQuestion(message);
    //             } else {
    //                 answerInsertOption.answer_id = currentAnswer;
    //             }
    //         }
    //     } else {
    //         const currentAnswerString = String(currentAnswer);
    //         const max = 100;

    //         if (currentAnswerString.length > max) {
    //             sendErrorAnswer(message.channel, `Sua resposta precisa ter menos de ${max} caracteres`);
    //             return await showWhitelistQuestion(message);
    //         } else {
    //             answerInsertOption.value = currentAnswer;
    //         }
    //     }

    //     if (
    //         answerInsertOption.answer_id
    //         || answerInsertOption.value
    //     ) {
    //         await knex('discord_whitelist_user_answers').insert(answerInsertOption);
    //         return await showWhitelistQuestion(message);
    //     }
}

// async function getAllUsersAnswers() {
//         const questions = await knex('discord_questions')
//             .where('discord_questions.deleted_at', null)
//             .orderBy('discord_questions.order')
//             .select('discord_questions.question_id', 'discord_questions.type', 'discord_questions.description');

//         const answers = await knex('discord_whitelist')
//             .leftJoin('discord_whitelist_user_answers', 'discord_whitelist.user_id', 'discord_whitelist_user_answers.user_id')
//             .leftJoin('discord_questions_answers', 'discord_whitelist_user_answers.answer_id', 'discord_questions_answers.answer_id')
//             .where('discord_whitelist.deleted_at', null)
//             .orderBy(['discord_whitelist.username', 'discord_whitelist_user_answers.question_id'])
//             .select(
//                 'discord_whitelist.user_id',
//                 'discord_whitelist.username',
//                 'discord_whitelist.player_id',
//                 'discord_whitelist.finished_at',
//                 'discord_whitelist_user_answers.question_id',
//                 'discord_whitelist_user_answers.value',
//                 'discord_questions_answers.description'
//             );

//         const usersAnswers = {};
//         for (let i in answers) {
//             const answer = answers[i];

//             if (!usersAnswers[answer.user_id]) {
//                 usersAnswers[answer.user_id] = {
//                     user_id: answer.user_id,
//                     username: answer.username,
//                     player_id: answer.player_id,
//                     finished_at: answer.finished_at,
//                     answers: {},
//                 };
//             }

//             if (answer.question_id) {
//                 if (!usersAnswers[answer.user_id].answers[answer.question_id]) {
//                     usersAnswers[answer.user_id].answers[answer.question_id] = {
//                         question_id: answer.question_id,
//                         value: answer.description ? answer.description : answer.value,
//                     };
//                 }
//             }
//         }

//         return {
//             questions,
//             usersAnswers,
//         };
// }

module.exports = {
    start,
    reset,
    setAnswer,
};
