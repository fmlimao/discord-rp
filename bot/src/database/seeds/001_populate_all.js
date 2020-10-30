
exports.seed = async function (knex) {

    // {
    //     type: 'options',
    //     description: 'Qual o nome do seu personagem?',
    // },
    // {
    //     type: 'options',
    //     description: 'Qual foi o ID apresentado no fivem?',
    // },
    await knex('wl_questions').insert([
        {
            type: 'options',
            description: 'O que é VDM?',
            order: '1',
        },
        {
            type: 'options',
            description: 'O que é RDM?',
            order: '2',
        },
        {
            type: 'options',
            description: 'O que é Meta Gaming?',
            order: '3',
        },
        {
            type: 'options',
            description: 'O que é Power Gaming?',
            order: '4',
        },
        {
            type: 'options',
            description: 'O que é Combat Logging?',
            order: '5',
        },
        {
            type: 'options',
            description: 'O que é uma Safe Zone?',
            order: '6',
        },
        {
            type: 'options',
            description: 'O que é Forçar RP?',
            order: '7',
        },
        {
            type: 'options',
            description: 'O que é Anti RP?',
            order: '8',
        },
        {
            type: 'options',
            description: 'O que é AMOR A VIDA?',
            order: '9',
        },
        {
            type: 'options',
            description: 'Com quantas advertências pode resultar em banimento?',
            order: '10',
        },
        {
            type: 'options',
            description: 'Para assaltar pessoas, necessitam ter no minimo:',
            order: '11',
        },
        {
            type: 'options',
            description: 'O que fazer se você ver alguém abusando de um bug?',
            order: '12',
        },
        {
            type: 'options',
            description: 'Você está sendo assaltado por dois assaltantes armados, porém você tem uma arma. O que você faria?',
            order: '13',
        },
        {
            type: 'options',
            description: 'Caso esteja em alguma ação e você acha que seu adversário fez algo errado, o que voce deve fazer?',
            order: '14',
        },
        {
            type: 'options',
            description: 'Você está em alta velocidade, bate o veículo, e seu personagem é arremessado pelo vidro, porém, o mesmo levanta como se nada estivesse acontecido. O que você faria?',
            order: '15',
        },
        {
            type: 'options',
            description: 'Após finalizado, o que fazer?',
            order: '16',
        },
    ]);

    await knex('wl_answers').insert([
        { question_id: 1, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 1, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 1, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 2, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 2, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 2, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 3, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 3, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 3, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 4, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 4, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 4, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 5, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 5, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 5, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 6, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 6, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 6, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 7, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 7, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 7, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 8, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 8, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 8, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 9, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 9, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 9, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 10, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 10, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 10, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        { question_id: 11, is_correct: 0, option: 1, order: '1', description: 'opcao 1', },
        { question_id: 11, is_correct: 0, option: 2, order: '2', description: 'opcao 2', },
        { question_id: 11, is_correct: 0, option: 3, order: '3', description: 'opcao 3', },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 12,
            description: '1 Atençao',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 12,
            description: '2 Advertencias',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 12,
            description: '3 Advertencias',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 13,
            description: 'Nenhum PM on',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 13,
            description: '1 PM online',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 13,
            description: '2 PM online',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 14,
            description: 'Nao fazer nada pois nao sou eu que estou abusando',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 14,
            description: 'Chamar alguem da staff pelo discord',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 14,
            description: 'Ir la e abusar junto com o cara',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 15,
            description: 'Entrego todos meus items',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 15,
            description: 'Reajo pois eu tenho uma arma',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 15,
            description: 'Chamo os policiais',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 16,
            description: 'Interrompo a açao pra falar com ele',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 16,
            description: 'Chamaria algum moderador acabando com todo o RP',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 16,
            description: 'Gravaria se possível e depois acionaria um moderador após a ação',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 17,
            description: 'Me deito e chamo o samu, pois estou machucado.',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 17,
            description: 'Me levanto pois o jogo me levantou',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 17,
            description: 'Chamo um amigo pra vir me buscar.',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

    await knex('wl_answers').insert([
        {
            question_id: 18,
            description: 'Seguir o RP,nao lembrando dos ultimos 15 minutos',
            option: 1,
            is_correct: 0,
            order: '1',
        },
        {
            question_id: 18,
            description: 'Chamar samu, apos os bandidos sairem do local',
            option: 2,
            is_correct: 0,
            order: '2',
        },
        {
            question_id: 18,
            description: 'Voltar na açao e matar todos',
            option: 3,
            is_correct: 0,
            order: '3',
        },
    ]);

};
