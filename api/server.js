require('dotenv-safe').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');

const { Client } = require('discord.js');
const client = new Client();

// client.on('ready', () => {
//     console.log('=> BOT: Bot iniciado');

//     const guild = client.guilds.cache.get(process.env.BOT_GUILD_ID);
//     console.log(' - guild', guild.id, guild.name);
//     // console.log(' - guild.members', guild.members);

//     guild.members.cache.map(member => {
//         console.log('   - member', member.user.id, member.user.username);
//         // console.log('   - member', member);
//     });
// });

client.login(process.env.BOT_TOKEN);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

// Middlaware de Retorno JSON
app.use(require('./src/middlewares/json-return'));

// Rotas
app.use(require('./src/routes'));

app.use(require('./src/middlewares/error-404'));
app.use(require('./src/middlewares/error-500'));

app.listen(process.env.APP_PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.APP_PORT}`);
});
