const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const knex = require('../database/connection');

async function verifyUserAction(message) {
    const user_id = message.author.id;

    // buscando ação atual
    const userAction = await knex('wl_user_actions')
        .where('wl_user_actions.deleted_at', null)
        .where('wl_user_actions.user_id', user_id)
        .where(knex.raw('`wl_user_actions`.`updated_at` > DATE_SUB(NOW(), INTERVAL 5 MINUTE)'))
        .select('wl_user_actions.user_id', 'wl_user_actions.action', 'wl_user_actions.created_at')
        .orderBy('wl_user_actions.user_action_id', 'desc')
        .limit(1)
        .first();

    if (userAction) {
        return userAction.action;
    }

    return false;
}

async function updateUserAction(message, action) {
    const user_id = message.author.id;

    // buscando ação atual
    const userAction = await knex('wl_user_actions')
        .where('wl_user_actions.deleted_at', null)
        .where('wl_user_actions.user_id', user_id)
        .where(knex.raw('`wl_user_actions`.`updated_at` > DATE_SUB(NOW(), INTERVAL 5 MINUTE)'))
        .select('wl_user_actions.user_action_id', 'wl_user_actions.user_id', 'wl_user_actions.action', 'wl_user_actions.created_at')
        .orderBy('wl_user_actions.user_action_id', 'desc')
        .limit(1)
        .first();

    // se ja tem uma ação ativa...
    if (userAction) {
        // e essa ação é a mesmoa solicitada...
        if (userAction.action === action) {
            // atualizo o registro
            await knex('wl_user_actions')
                .where('wl_user_actions.user_action_id', userAction.user_action_id)
                .update({
                    updated_at: knex.fn.now(),
                });

            return;
        }

        // se for outra ação, deleto ela
        await knex('wl_user_actions')
            .where('wl_user_actions.user_action_id', userAction.user_action_id)
            .update({
                deleted_at: knex.fn.now(),
            });
    }

    // e inserimos a nova ação
    await knex('wl_user_actions').insert({
        user_id,
        action,
    });
}

async function userWhitelistManager(message) {
    const user_id = message.author.id;
    const currentAnswer = message.content;
    console.log('-------', user_id, currentAnswer);

    // força a ultima ação
    updateUserAction(message, 'whitelist');

    // sempre que o usuario mandar uma mensagem DM para o bot,
    // iremos verificar em qual estagio do questionario ele está...

    // buscando estagio do whitelist
    const userWhitelist = await knex('wl_users')
        .where('wl_users.deleted_at', null)
        .where('wl_users.user_id', user_id)
        .select('wl_users.user_id', 'wl_users.player_id', 'wl_users.finished_at')
        .first();
    // console.log('');
    // console.log('userWhitelist:', userWhitelist);

    // buscando as perguntas e respostas
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
    // console.log('');
    // console.log('questionsList:', questionsList);

    let questionIdWithoutAnswer = null;
    for (let i in questionsList) {
        if (!questionsList[i].userAnswer) {
            questionIdWithoutAnswer = questionsList[i].question_id;
            break;
        }
    }
    // console.log('');
    // console.log('questionIdWithoutAnswer:', questionIdWithoutAnswer);

    // se o usuário ainda nao tem o registro, criamos um
    if (!userWhitelist) {
        console.log(' - CRIANDO REGISTRO DO USUARIO');

        await knex('wl_users').insert({
            user_id: user_id,
        });

        const msg = `Iremos iniciar um pequeno questionário para te habilitar em nossos servidores. Serão apenas 5 perguntas, para saber se você conhece nossas regras, ou seja, é importante que você leia todo o conteúdo do canal Regras, ok?`;
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        message.author.send(response);

        userWhitelistManager(message);
        return;
    }

    // se o usuário ja tem o registro...

    // e se já está finalizado, avisamos o usuário
    if (userWhitelist.finished_at) {
        console.log(' - USUARIO JA FINALIZOU A WHITELIST');

        const msg = `Parabéns! Você já finalizou o whitelist!!!`;
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x00ff00)
            .setDescription(`${msg}`);
        message.author.send(response);
        return;
    }

    // se ainda não está finalizada...

    // e não tem o player_id, solicitamos ele
    if (!userWhitelist.player_id) {

        // analisar resposta do usuário
        if (currentAnswer) {
            const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

            if (currentAnswer !== currentAnswerClean) {
                console.log(' - PLAYER ID INVALIDO');

                const msg = `Player ID inválido!`;
                const response = new MessageEmbed()
                    .setTitle(`Resposta Inválida`)
                    .setColor(0xff0000)
                    .setDescription(`${msg}`);
                message.author.send(response);
            } else {
                console.log(' - SALVANDO PLAYER ID...');

                await knex('wl_users')
                    .where('wl_users.deleted_at', null)
                    .where('wl_users.user_id', user_id)
                    .update({
                        player_id: currentAnswer,
                    });

                message.content = '';
                userWhitelistManager(message);
                return;
            }
        }

        console.log(' - SOLICITAR PLAYER ID');

        const msg = `Para iniciar o questionário, nos informe o seu ID de jogador do nosso servidor:`;
        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        message.author.send(response);
        return;
    }

    // se já tiver o player_id...

    // e ainda estiver faltando alguma pergunta pra responder,
    // exibimos ela
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
                    console.log(' - RESPOSTA INVALIDA 1');

                    const msg = `Sua resposta precisa ser uma das listadas acima!`;
                    const response = new MessageEmbed()
                        .setTitle(`Resposta Inválida`)
                        .setColor(0xff0000)
                        .setDescription(`${msg}`);
                    message.author.send(response);
                } else {
                    let isValidAnswer = false;
                    for (let i in questionsList[questionIdWithoutAnswer].answers) {
                        if (questionsList[questionIdWithoutAnswer].answers[i].option == currentAnswer) {
                            isValidAnswer = true;
                        }
                    }

                    if (!isValidAnswer) {
                        console.log(' - RESPOSTA INVALIDA 2');

                        const msg = `Sua resposta precisa ser uma das listadas acima!`;
                        const response = new MessageEmbed()
                            .setTitle(`Resposta Inválida`)
                            .setColor(0xff0000)
                            .setDescription(`${msg}`);
                        message.author.send(response);
                    } else {
                        answerInsertOption.answer_id = currentAnswer;
                    }
                }
            } else {
                const currentAnswerString = String(currentAnswer);

                if (currentAnswerString.length > 10) {
                    console.log(' - RESPOSTA INVALIDA 3');

                    const msg = `Sua resposta precisa ter menos de 10 caracteres`;
                    const response = new MessageEmbed()
                        .setTitle(`Resposta Inválida`)
                        .setColor(0xff0000)
                        .setDescription(`${msg}`);
                    message.author.send(response);
                } else {
                    answerInsertOption.value = currentAnswer;
                }
            }

            if (
                answerInsertOption.answer_id
                || answerInsertOption.value
            ) {
                await knex('wl_user_answers').insert(answerInsertOption);
                message.content = '';
                userWhitelistManager(message);
                return;
            }

        }

        console.log(' - EXIBINDO PERGUNTA ' + questionIdWithoutAnswer);
        console.log('   - ' + questionsList[questionIdWithoutAnswer].question_id + '] ' + questionsList[questionIdWithoutAnswer].description);

        let msg = `${questionsList[questionIdWithoutAnswer].question_id}] ${questionsList[questionIdWithoutAnswer].description}\n`;

        if (questionsList[questionIdWithoutAnswer].type === 'options') {
            for (let i in questionsList[questionIdWithoutAnswer].answers) {
                console.log('     - (' + questionsList[questionIdWithoutAnswer].answers[i].option + ') ' + questionsList[questionIdWithoutAnswer].answers[i].description);
                msg += `\n    (${questionsList[questionIdWithoutAnswer].answers[i].option}) ${questionsList[questionIdWithoutAnswer].answers[i].description}`;
            }
        }

        const response = new MessageEmbed()
            .setTitle(`Questionário de Whitelist`)
            .setColor(0x0000ff)
            .setDescription(`${msg}`);
        message.author.send(response);
        return;
    }

    // se nao tem mais nenhuma pergunta, finalizamos a whitelist
    console.log(' - FINALIZANDO WHITELIST');

    await knex('wl_users')
        .where('wl_users.deleted_at', null)
        .where('wl_users.user_id', user_id)
        .update({
            finished_at: knex.fn.now(),
        });

    message.content = '';
    userWhitelistManager(message);
    return;
};

module.exports = {

    userWhitelistManager,
    verifyUserAction,

};
