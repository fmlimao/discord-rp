
exports.seed = async function (knex) {



    await knex('bot_users').insert([
        {
            name: 'Leandro Macedo',
            email: 'fmlimao@gmail.com',
            password: '$2b$10$Vl/VPcAGUwW0JzW4p3r5cegLmnrHaLiaCspb1r8408iAgXA3vAewW',
            salt: '$2b$10$Vl/VPcAGUwW0JzW4p3r5ce',
        },
    ]);



};
