const knex = require('../../../database/connection');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const questions = await knex('discord_whitelist_questions')
            .where('discord_whitelist_questions.deleted_at', null)
            .orderBy('discord_whitelist_questions.order')
            .select('discord_whitelist_questions.question_id', 'discord_whitelist_questions.type', 'discord_whitelist_questions.description');

        const answers = await knex('discord_whitelist')
            .innerJoin('discord_users', 'discord_whitelist.user_id', 'discord_users.user_id')
            .leftJoin('discord_whitelist_user_answers', 'discord_whitelist.user_id', 'discord_whitelist_user_answers.user_id')
            .leftJoin('discord_whitelist_question_answers', 'discord_whitelist_user_answers.answer_id', 'discord_whitelist_question_answers.answer_id')
            .where('discord_whitelist.deleted_at', null)
            .whereNot('discord_whitelist.finished_at', null)
            .orderBy(['discord_whitelist.finished_at', 'discord_whitelist_user_answers.question_id'])
            .select(
                'discord_whitelist.user_id',
                'discord_users.username',
                'discord_users.avatar',
                'discord_whitelist.user_name',
                'discord_whitelist.user_email',
                'discord_whitelist.user_birth',
                'discord_whitelist.player_id',
                'discord_whitelist.player_name',
                'discord_whitelist.finished_at',
                'discord_whitelist_user_answers.question_id',
                'discord_whitelist_user_answers.value',
                'discord_whitelist_question_answers.description'
            );

        const usersAnswers = {};
        for (let i in answers) {
            const answer = answers[i];

            if (!usersAnswers[answer.user_id]) {
                usersAnswers[answer.user_id] = {
                    user_id: answer.user_id,
                    username: answer.username,
                    avatar: answer.avatar,
                    user_name: answer.user_name,
                    user_email: answer.user_email,
                    user_birth: answer.user_birth,
                    player_id: answer.player_id,
                    player_name: answer.player_name,
                    finished_at: answer.finished_at,
                    answers: {},
                };
            }

            if (answer.question_id) {
                if (!usersAnswers[answer.user_id].answers[answer.question_id]) {
                    usersAnswers[answer.user_id].answers[answer.question_id] = {
                        question_id: answer.question_id,
                        value: answer.description ? answer.description : answer.value,
                    };
                }
            }
        }

        ret.addContent('questions', questions);
        ret.addContent('answers', usersAnswers);
    } catch (err) {
        ret = require('../../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};
