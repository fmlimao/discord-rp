const discordManager = require('./discord');
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
    const userWhitelist = await knex('wl_users')
        .where('wl_users.deleted_at', null)
        .where('wl_users.user_id', user_id)
        .select('wl_users.user_id', 'wl_users.player_id', 'wl_users.finished_at')
        .first();

    return userWhitelist;
}

async function showWhitelistQuestion(message) {
    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    // e não tem o player_id, solicitamos ele
    if (!userWhitelist.player_id) {
        return sendMessage(message.author, 'Para iniciar o questionário, nos informe o seu ID de jogador do nosso servidor:');
    }

    // se já tiver o player_id...

    // buscando as perguntas e respostas
    const { questionsList, questionIdWithoutAnswer } = await getUserQuestionsAndAnswers(user_id);

    // se todas as pergutas já foram respondidas, finalizo o processo
    if (!questionIdWithoutAnswer) {
        await knex('wl_users')
            .where('wl_users.deleted_at', null)
            .where('wl_users.user_id', user_id)
            .update({
                finished_at: knex.fn.now(),
            });

        return sendSuccessMessage(message.author, 'Parabéns! Você já finalizou o whitelist!!!');
    }

    console.log(' - EXIBINDO PERGUNTA ' + questionIdWithoutAnswer);
    console.log('   - ' + questionsList[questionIdWithoutAnswer].question_id + '] ' + questionsList[questionIdWithoutAnswer].description);

    let msg = `${questionsList[questionIdWithoutAnswer].question_id} - ${questionsList[questionIdWithoutAnswer].description}\n`;

    if (questionsList[questionIdWithoutAnswer].type === 'options') {
        for (let i in questionsList[questionIdWithoutAnswer].answers) {
            console.log('     - [' + questionsList[questionIdWithoutAnswer].answers[i].option + '] ' + questionsList[questionIdWithoutAnswer].answers[i].description);
            msg += `\n    [${questionsList[questionIdWithoutAnswer].answers[i].option}] - ${questionsList[questionIdWithoutAnswer].answers[i].description}`;
        }
    }

    return sendMessage(message.author, msg);
}

async function getUserQuestionsAndAnswers(user_id) {
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

async function start(message, messageContent, messageCommand, messageArgs) {

    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    // se o usuário ainda nao tem o registro, criamos um
    if (!userWhitelist) {
        await knex('wl_users').insert({
            user_id: user_id,
        });

        sendMessage(message.author, 'Iremos iniciar um pequeno questionário para te habilitar em nossos servidores. Serão apenas 5 perguntas, para saber se você conhece nossas regras, ou seja, é importante que você leia todo o conteúdo do canal Regras, ok?');

        return await showWhitelistQuestion(message);
    }

    // se o usuário ja tem o registro...

    // e se já está finalizado, avisamos o usuário
    if (userWhitelist.finished_at) {
        return sendSuccessMessage(message.author, 'Parabéns! Você já finalizou o whitelist!!!');
    }

    // se ainda não está finalizada...
    return await showWhitelistQuestion(message);
}

async function setAnswer(message, messageContent, messageCommand, messageArgs) {
    const user_id = message.author.id;

    // buscando estagio do whitelist
    const userWhitelist = await getUserWhitelist(user_id);

    if (!userWhitelist) {
        return sendErrorAnswer(message.author, 'Você ainda não iniciou o whitelist. Para iniciar, responda com `!wl`.');
    }

    const currentAnswer = messageArgs.join(' ');

    // e não tem o player_id, recebemos ele
    if (!userWhitelist.player_id) {

        // analisar resposta do usuário
        const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

        if (currentAnswer !== currentAnswerClean) {
            sendErrorAnswer(message.author, 'Player ID inválido!');
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

    // se já tiver o player_id...

    // buscando as perguntas e respostas
    const { questionsList, questionIdWithoutAnswer } = await getUserQuestionsAndAnswers(user_id);

    // se todas as pergutas já foram respondidas, aviso o usuário
    if (!questionIdWithoutAnswer) {
        return sendSuccessMessage(message.author, 'Parabéns! Você já finalizou o whitelist!!!');
    }

    console.log(`Respondendo a pergunta ${questionIdWithoutAnswer}:`, currentAnswer);

    const answerInsertOption = {
        user_id: user_id,
        question_id: questionsList[questionIdWithoutAnswer].question_id,
    };

    if (questionsList[questionIdWithoutAnswer].type === 'options') {
        const currentAnswerClean = currentAnswer.replace(/\D+/g, '');

        if (currentAnswer !== currentAnswerClean) {
            sendErrorAnswer(message.author, 'Sua resposta precisa ser uma das listadas acima!');
            return await showWhitelistQuestion(message);
        } else {
            let isValidAnswer = false;
            for (let i in questionsList[questionIdWithoutAnswer].answers) {
                if (questionsList[questionIdWithoutAnswer].answers[i].option == currentAnswer) {
                    isValidAnswer = true;
                }
            }

            if (!isValidAnswer) {
                sendErrorAnswer(message.author, 'Sua resposta precisa ser uma das listadas acima!');
                return await showWhitelistQuestion(message);
            } else {
                answerInsertOption.answer_id = currentAnswer;
            }
        }
    } else {
        const currentAnswerString = String(currentAnswer);
        const max = 100;

        if (currentAnswerString.length > max) {
            sendErrorAnswer(message.author, `Sua resposta precisa ter menos de ${max} caracteres`);
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

module.exports = {
    start,
    setAnswer,
};
