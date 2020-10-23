const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const knex = require('../database/connection');

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

function showCommands(message, commands) {
    const response = new MessageEmbed()
        .setTitle(`Lista de Comandos`)
        .setColor(0x0099ff);

    for (let commandId in commands) {
        const command = commands[commandId];
        response.addField('`' + command.title + '`', command.description);
    }

    message.author.send(response);
}

async function getUserWhitelist(user_id) {
    const userWhitelist = await knex('wl_users')
        .where('wl_users.deleted_at', null)
        .where('wl_users.user_id', user_id)
        .select('wl_users.user_id', 'wl_users.player_id', 'wl_users.finished_at')
        .first();

    return userWhitelist;
}

async function getUserAnswers(user_id) {
    const questionsAndAnswers = await knex('wl_questions')
        .leftJoin('wl_answers', function () {
            this.onNull('wl_answers.deleted_at')
                .andOn('wl_answers.question_id', '=', 'wl_questions.question_id')
        })
        .leftJoin('wl_user_answers', function () {
            this.onNull('wl_user_answers.deleted_at')
                .andOn('wl_user_answers.question_id', '=', 'wl_questions.question_id')
                .andOn(knex.raw('wl_user_answers.user_id = ?', [user_id]))
        })
        .where('wl_questions.deleted_at', null)
        .select(
            'wl_questions.question_id AS wl_questions_question_id'
            , 'wl_questions.type AS wl_questions_type'
            , 'wl_questions.description AS wl_questions_description'
            , 'wl_questions.order AS wl_questions_order'

            , 'wl_answers.answer_id AS wl_answers_answer_id'
            , 'wl_answers.description AS wl_answers_description'
            , 'wl_answers.is_correct AS wl_answers_is_correct'
            , 'wl_answers.option AS wl_answers_option'

            , 'wl_user_answers.answer_id AS wl_user_answers_answer_id'
            , 'wl_user_answers.value AS wl_user_answers_value'
        )
        .orderBy('wl_questions.order', 'wl_answers.order');

    const questionsList = {};
    for (let i in questionsAndAnswers) {
        const row = questionsAndAnswers[i];

        if (typeof questionsList[row.wl_questions_question_id] == 'undefined') {
            questionsList[row.wl_questions_question_id] = {
                question_id: row.wl_questions_question_id,
                type: row.wl_questions_type,
                description: row.wl_questions_description,
                order: row.wl_questions_order,
            };

            if (row.wl_questions_type === 'options') {
                questionsList[row.wl_questions_question_id].userAnswer = row.wl_user_answers_answer_id;
                questionsList[row.wl_questions_question_id].answers = {};
            } else {
                questionsList[row.wl_questions_question_id].userAnswer = row.wl_user_answers_value;
            }
        }

        if (row.wl_answers_answer_id) {
            if (typeof questionsList[row.wl_questions_question_id].answers[row.wl_answers_answer_id] == 'undefined') {
                questionsList[row.wl_questions_question_id].answers[row.wl_answers_answer_id] = {
                    answer_id: row.wl_answers_answer_id,
                    description: row.wl_answers_description,
                    is_correct: row.wl_answers_is_correct,
                    option: row.wl_answers_option,
                };
            }
        }
    }

    let questionIdWithoutAnswer = null;
    for (let i in questionsList) {
        if (!questionsList[i].userAnswer) {
            questionIdWithoutAnswer = questionsList[i].question_id;
            break;
        }
    }

    return {
        questionsList,
        questionIdWithoutAnswer,
    };
}

async function showWhitelistQuestion(message) {
    console.log('showWhitelistQuestion()');

    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    // e não tem o player_id, solicitamos ele
    if (!userWhitelist.player_id) {
        const msg = `Para iniciar o questionário, nos informe o seu ID de jogador do nosso servidor:`;
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        message.author.send(response);
        return;
    }

    // se já tiver o player_id...

    // buscando as perguntas e respostas
    const { questionsList, questionIdWithoutAnswer } = await getUserAnswers(user_id);

    // se ainda estiver faltando alguma pergunta pra responder, exibimos ela
    if (questionIdWithoutAnswer) {
        console.log(' - EXIBINDO PERGUNTA ' + questionIdWithoutAnswer);
        console.log('   - ' + questionsList[questionIdWithoutAnswer].question_id + '] ' + questionsList[questionIdWithoutAnswer].description);

        let msg = `${questionsList[questionIdWithoutAnswer].question_id} - ${questionsList[questionIdWithoutAnswer].description}\n`;

        if (questionsList[questionIdWithoutAnswer].type === 'options') {
            for (let i in questionsList[questionIdWithoutAnswer].answers) {
                console.log('     - [' + questionsList[questionIdWithoutAnswer].answers[i].option + '] ' + questionsList[questionIdWithoutAnswer].answers[i].description);
                msg += `\n    [${questionsList[questionIdWithoutAnswer].answers[i].option}] - ${questionsList[questionIdWithoutAnswer].answers[i].description}`;
            }
        }

        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        return message.author.send(response);
    }

    // se nao tem mais nenhuma pergunta, finalizamos a whitelist

    await knex('wl_users')
        .where('wl_users.deleted_at', null)
        .where('wl_users.user_id', user_id)
        .update({
            finished_at: knex.fn.now(),
        });

    const response = new MessageEmbed()
        .setTitle(`Questionário de Whitelist`)
        .setColor(0x00ff00)
        .setDescription(`Parabéns! Você já finalizou o whitelist!!!`);
    return message.author.send(response);
}

async function commandWhitelistStart(message, messageContent, messageCommand, messageArgs) {
    console.log('commandWhitelistStart()', messageContent);

    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    // se o usuário ainda nao tem o registro, criamos um
    if (!userWhitelist) {
        await knex('wl_users').insert({
            user_id: user_id,
        });

        const msg = `Iremos iniciar um pequeno questionário para te habilitar em nossos servidores. Serão apenas 5 perguntas, para saber se você conhece nossas regras, ou seja, é importante que você leia todo o conteúdo do canal Regras, ok?`;
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        message.author.send(response);

        return await showWhitelistQuestion(message);
    }

    // se o usuário ja tem o registro...

    // e se já está finalizado, avisamos o usuário
    if (userWhitelist.finished_at) {
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x00ff00)
            .setDescription(`Parabéns! Você já finalizou o whitelist!!!`);
        return message.author.send(response);
    }

    // se ainda não está finalizada...
    return await showWhitelistQuestion(message);
}

async function commandWhitelistAnswer(message, messageContent, messageCommand, messageArgs) {
    console.log('commandWhitelistAnswer()', messageContent);

    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);
    console.log('userWhitelist', userWhitelist);

    if (!userWhitelist) {
        const response = new MessageEmbed()
            .setTitle(`Whitelist não iniciada!`)
            .setColor(0xff0000)
            .setDescription('Você ainda não iniciou o whitelist. Para iniciar, responda com `!wl`.');
        return message.author.send(response);
    }

    const currentAnswer = messageArgs.join(' ');

    // e não tem o player_id, recebemos ele
    if (!userWhitelist.player_id) {

        // analisar resposta do usuário
        if (currentAnswer) {
            const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

            if (currentAnswer !== currentAnswerClean) {
                const response = new MessageEmbed()
                    .setTitle(`Resposta Inválida`)
                    .setColor(0xff0000)
                    .setDescription(`Player ID inválido!`);
                message.author.send(response);

                return await showWhitelistQuestion(message);
            } else {
                await knex('wl_users')
                    .where('wl_users.deleted_at', null)
                    .where('wl_users.user_id', user_id)
                    .update({
                        player_id: currentAnswer,
                    });

                return await showWhitelistQuestion(message);
            }
        }

    }

    // buscando as perguntas e respostas
    const { questionsList, questionIdWithoutAnswer } = await getUserAnswers(user_id);

    // se já tiver o player_id...

    // se ainda estiver faltando alguma pergunta pra responder, salvamos ela
    if (questionIdWithoutAnswer) {

        // analisar resposta do usuário
        if (currentAnswer) {
            const answerInsertOption = {
                user_id: user_id,
                question_id: questionsList[questionIdWithoutAnswer].question_id,
            };

            if (questionsList[questionIdWithoutAnswer].type === 'options') {
                const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

                if (currentAnswer !== currentAnswerClean) {
                    const response = new MessageEmbed()
                        .setTitle(`Resposta Inválida`)
                        .setColor(0xff0000)
                        .setDescription(`Sua resposta precisa ser uma das listadas acima!`);
                    message.author.send(response);

                    return await showWhitelistQuestion(message);
                } else {
                    let isValidAnswer = false;
                    for (let i in questionsList[questionIdWithoutAnswer].answers) {
                        if (questionsList[questionIdWithoutAnswer].answers[i].option == currentAnswer) {
                            isValidAnswer = true;
                        }
                    }

                    if (!isValidAnswer) {
                        const response = new MessageEmbed()
                            .setTitle(`Resposta Inválida`)
                            .setColor(0xff0000)
                            .setDescription(`Sua resposta precisa ser uma das listadas acima!`);
                        message.author.send(response);

                        return await showWhitelistQuestion(message);
                    } else {
                        answerInsertOption.answer_id = currentAnswer;
                    }
                }
            } else {
                const currentAnswerString = String(currentAnswer);

                if (currentAnswerString.length > 10) {
                    const response = new MessageEmbed()
                        .setTitle(`Resposta Inválida`)
                        .setColor(0xff0000)
                        .setDescription(`Sua resposta precisa ter menos de 10 caracteres`);
                    message.author.send(response);

                    return await showWhitelistQuestion(message);
                } else {
                    answerInsertOption.value = currentAnswer;
                }
            }

            if (
                answerInsertOption.answer_id
                || answerInsertOption.value
            ) {
                await knex('wl_user_answers').insert(answerInsertOption);
                return await showWhitelistQuestion(message);
            }

        }
    }

    return await showWhitelistQuestion(message);
}

async function commandStoreShow(message, messageContent, messageCommand, messageArgs) {
    console.log('commandStoreShow()', messageContent);
}

async function commandCartShow(message, messageContent, messageCommand, messageArgs) {
    console.log('commandCartShow()', messageContent);
}

async function commandCartAdd(message, messageContent, messageCommand, messageArgs) {
    console.log('commandCartAdd()', messageContent);
}

async function commandCartRemove(message, messageContent, messageCommand, messageArgs) {
    console.log('commandCartRemove()', messageContent);
}

async function commandCartPay(message, messageContent, messageCommand, messageArgs) {
    console.log('commandCartPay()', messageContent);
}

module.exports = {

    checkIsValidCommand,
    showCommands,

    commandWhitelistStart,
    commandWhitelistAnswer,
    commandStoreShow,
    commandCartShow,
    commandCartAdd,
    commandCartRemove,
    commandCartPay,

};
