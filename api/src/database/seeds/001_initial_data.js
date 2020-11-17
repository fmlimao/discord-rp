
exports.seed = async function (knex) {



    await knex('discord_system_users').insert([
        {
            name: 'Leandro',
            email: 'fmlimao@gmail.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
    ]);

    await knex('discord_whitelist_questions').insert([
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
            description: 'O que é uma Safe-Zone?',
            order: '6',
        },
        {
            type: 'options',
            description: 'O que é Forçar RP?',
            order: '7',
        },
        {
            type: 'options',
            description: 'O que é Anti-RP?',
            order: '8',
        },
        {
            type: 'options',
            description: 'O que é AMOR A VIDA?',
            order: '9',
        },
        {
            type: 'options',
            description: 'Quantas advertências pode resultar em banimento?',
            order: '10',
        },
        {
            type: 'options',
            description: 'Para assaltar pessoas, necessitam ter no minimo quantos policiais online?',
            order: '11',
        },
        {
            type: 'options',
            description: 'O que fazer se você ver alguém abusando de um bug?',
            order: '12',
        },
        {
            type: 'options',
            description: 'Você está sendo assaltado por dois assaltantes armados, porém, você tem uma arma. O que você faria?',
            order: '13',
        },
        {
            type: 'options',
            description: 'Caso esteja em alguma ação e você acha que seu adversário fez algo errado, o que voce deve fazer?',
            order: '14',
        },
        {
            type: 'options',
            description: 'Você está em alta velocidade, bate o veículo e seu personagem é arremessado pelo vidro, porém, o mesmo se levanta como se nada tivesse acontecido. O que você faria?',
            order: '15',
        },
        {
            type: 'options',
            description: 'Após finalizado, o que fazer?',
            order: '16',
        },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 1, is_correct: 1, option: 1, order: '1', description: 'Utilizar um veiculo para matar alguem', },
        { question_id: 1, is_correct: 0, option: 2, order: '2', description: 'Matar alguém sem motivo.', },
        { question_id: 1, is_correct: 0, option: 3, order: '3', description: 'Vender algo para um moderador ', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 2, is_correct: 0, option: 1, order: '1', description: 'É reagir quando for assaltado.', },
        { question_id: 2, is_correct: 0, option: 2, order: '2', description: 'É rir da cara de um moderador.', },
        { question_id: 2, is_correct: 1, option: 3, order: '3', description: 'Matar alguém sem motivo.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 3, is_correct: 0, option: 1, order: '1', description: 'É utilizar algo de metal para matar outro player.', },
        { question_id: 3, is_correct: 1, option: 2, order: '2', description: 'Utilizar informações de fora do RP para obter vantagens dentro do RP.', },
        { question_id: 3, is_correct: 0, option: 3, order: '3', description: 'É atropelar alguém e não prestar ajuda.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 4, is_correct: 1, option: 1, order: '1', description: 'É algo que não possa ser feito na vida real.', },
        { question_id: 4, is_correct: 0, option: 2, order: '2', description: 'É passar buzinando na frente do hospital.', },
        { question_id: 4, is_correct: 0, option: 3, order: '3', description: 'É matar algúem sem motivo.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 5, is_correct: 0, option: 1, order: '1', description: 'É pedir o log de um combate para um admin.', },
        { question_id: 5, is_correct: 0, option: 2, order: '2', description: 'É chamar os amigos para fazer um combate.', },
        { question_id: 5, is_correct: 1, option: 3, order: '3', description: 'Fugir ou se deslogar antes de uma ação terminar.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 6, is_correct: 0, option: 1, order: '1', description: 'São postos de gasolina, lojinhas e garagens.', },
        { question_id: 6, is_correct: 1, option: 2, order: '2', description: 'São concessionárias, a praça, hospitais, delegacias e Aeroporto (Onde nascemos).', },
        { question_id: 6, is_correct: 0, option: 3, order: '3', description: 'São favelas, ruas pouco iluminadas e becos sem saída.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 7, is_correct: 0, option: 1, order: '1', description: 'Forçar para se tornar famoso na cidade.', },
        { question_id: 7, is_correct: 0, option: 2, order: '2', description: 'Forçar para entrar no servidor quando o mesmo está desligado.', },
        { question_id: 7, is_correct: 1, option: 3, order: '3', description: 'Forçar outros players a fazer um RP;', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 8, is_correct: 0, option: 1, order: '1', description: 'É ser do partido oposto ao Prefeito da cidade.', },
        { question_id: 8, is_correct: 1, option: 2, order: '2', description: 'É não desenvolver um papel da vida real. Não seguir a interpretação de personagem conformes as regras e a vida real.', },
        { question_id: 8, is_correct: 0, option: 3, order: '3', description: 'É trabalhar em uma profissão que dá pouco dinheiro, afinal, todos querem ter muito dinheiro.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 9, is_correct: 0, option: 1, order: '1', description: 'É dirigir em alta velocidade para curtir a vida ao máximo mostrando que você a ama.', },
        { question_id: 9, is_correct: 0, option: 2, order: '2', description: 'É se tornar muito rico para ter uma vida boa.', },
        { question_id: 9, is_correct: 1, option: 3, order: '3', description: 'É zelar e preservar a vida como se fosse única.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 10, is_correct: 1, option: 1, order: '1', description: '3', },
        { question_id: 10, is_correct: 0, option: 2, order: '2', description: '5', },
        { question_id: 10, is_correct: 0, option: 3, order: '3', description: '10', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 11, is_correct: 0, option: 1, order: '1', description: '1 policial em patrulha.', },
        { question_id: 11, is_correct: 1, option: 2, order: '2', description: '2 policiais em patrulha.', },
        { question_id: 11, is_correct: 0, option: 3, order: '3', description: '3 policiais em patrulha.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 12, is_correct: 0, option: 1, order: '1', description: 'Nada, não sou eu que estou abusando.', },
        { question_id: 12, is_correct: 0, option: 2, order: '2', description: 'Aproveitar do bug, pois não é todo dia que se encontra um.', },
        { question_id: 12, is_correct: 1, option: 3, order: '3', description: 'Peça para o player não continuar fazendo isso. Se possível, grave e chame alguém da staff.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 13, is_correct: 0, option: 1, order: '1', description: 'Reajo e tento matá-los, pois sou bom de tiro.', },
        { question_id: 13, is_correct: 1, option: 2, order: '2', description: 'Entrego tudo sem reagir, pois tenho amor à vida.', },
        { question_id: 13, is_correct: 0, option: 3, order: '3', description: 'Deslogo na hora, afinal não quero perder minhas coisas.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 14, is_correct: 0, option: 1, order: '1', description: 'Nao fazer nada. Segue o jogo. Não sou eu que estou fazendo algo errado.', },
        { question_id: 14, is_correct: 1, option: 2, order: '2', description: 'Se possível gravar e chamar alguém da staff pelo discord após terminar a ação.', },
        { question_id: 14, is_correct: 0, option: 3, order: '3', description: 'Você faz igual, afinal, se ele pode, você pode também.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 15, is_correct: 1, option: 1, order: '1', description: 'Me deito e chamo o samu, pois estou machucado.', },
        { question_id: 15, is_correct: 0, option: 2, order: '2', description: 'Me levanto pois o jogo me levantou', },
        { question_id: 15, is_correct: 0, option: 3, order: '3', description: 'Chamo um amigo pra vir me buscar.', },
    ]);

    await knex('discord_whitelist_question_answers').insert([
        { question_id: 16, is_correct: 1, option: 1, order: '1', description: 'Seguir o RP,nao lembrando dos ultimos 15 minutos', },
        { question_id: 16, is_correct: 0, option: 2, order: '2', description: 'Chamar samu, apos os bandidos sairem do local', },
        { question_id: 16, is_correct: 0, option: 3, order: '3', description: 'Voltar na açao e matar todos', },
    ]);
};
