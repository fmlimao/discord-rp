const knex = require('../../../database/connection');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const questions = await knex('discord_whitelist_questions')
            .where('discord_whitelist_questions.deleted_at', null)
            .leftOuterJoin('discord_whitelist_question_answers', function () {
                this
                    .on('discord_whitelist_questions.question_id', 'discord_whitelist_question_answers.question_id')
                    .onNull('discord_whitelist_question_answers.deleted_at');
            })
            .orderBy(['discord_whitelist_questions.order', 'discord_whitelist_question_answers.order'])
            .select(
                'discord_whitelist_questions.question_id',
                'discord_whitelist_questions.type as question_type',
                'discord_whitelist_questions.description as question_description',
                'discord_whitelist_questions.order as question_order',

                'discord_whitelist_question_answers.answer_id',
                'discord_whitelist_question_answers.description as answer_description',
                'discord_whitelist_question_answers.option as answer_option',
                'discord_whitelist_question_answers.is_correct as answer_is_correct',
                'discord_whitelist_question_answers.order as answer_order'
            );

        const questionsList = {};
        for (let i in questions) {
            const question = questions[i];

            if (!questionsList[question.question_id]) {
                questionsList[question.question_id] = {
                    question_id: question.question_id,
                    type: question.question_type,
                    description: question.question_description,
                    order: question.question_order,
                    answers: {},
                };
            }

            if (question.answer_id) {
                if (!questionsList[question.question_id].answers[question.answer_id]) {
                    questionsList[question.question_id].answers[question.answer_id] = {
                        answer_id: question.answer_id,
                        description: question.answer_description,
                        option: question.answer_option,
                        is_correct: question.answer_is_correct,
                        order: question.answer_order,
                    };
                }
            }
        }

        ret.addContent('questions', questionsList);
    } catch (err) {
        ret = require('../../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
