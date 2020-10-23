
exports.seed = async function (knex) {

    await knex('wl_questions').insert([
        {
            type: 'options',
            description: 'Quanto é 1 + 1?',
            order: '1',
        },
        {
            type: 'options',
            description: 'Qual é o super heroi que usa a cueca por cima da calça?',
            order: '2',
        },
        {
            type: 'text',
            description: 'Qual o seu nome?',
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 1,
            description: '4',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 1,
            description: '3',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 1,
            description: '2',
            option: 3,
            is_correct: 1,
            order: '3',
        },
        {
            question_id: 1,
            description: '1',
            option: 4,
            is_correct: 0,
            order: '4',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 2,
            description: 'Batman',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 2,
            description: 'Superman',
            option: 2,
            is_correct: 1,
            order: '2',
        },
        {
            question_id: 2,
            description: 'Homem-Aranha',
            option: 3,
            is_correct: 0,
            order: '3',
        },
        {
            question_id: 2,
            description: 'Mickey',
            option: 4,
            is_correct: 0,
            order: '4',
        },
    ]);

    // await knex('wl_users').insert([
    //     {
    //         user_id: '436949125603393538',
    //         player_id: 1234,
    //         finished_at: knex.fn.now(),
    //     },
    // ]);

    // await knex('wl_user_answers').insert([
    //     {
    //         user_id: '436949125603393538',
    //         question_id: 1,
    //         answer_id: 3,
    //     },
    //     {
    //         user_id: '436949125603393538',
    //         question_id: 2,
    //         answer_id: 1,
    //     },
    //     {
    //         user_id: '436949125603393538',
    //         question_id: 3,
    //         value: 'Lele',
    //     },
    // ]);

};
