const axios = require('axios');

const getDiscordTokenData = async (code) => {
    const data = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
        code: code,
        scope: 'identify email guilds',
    };

    return (
        await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams(data),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
    ).data;
};

const getDiscordUserData = async (token) => {
    return (
        await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    'authorization': `${token.token_type} ${token.access_token}`,
                },
            }
        )
    ).data;
};

const getDiscordUserGuilds = async (token) => {
    return (
        await axios.get(
            'https://discord.com/api/users/@me/guilds',
            {
                headers: {
                    'authorization': `${token.token_type} ${token.access_token}`,
                },
            }
        )
    ).data;
};

const getDiscordUserGuildMember = async (user_id) => {
    return (
        await axios.get(
            `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user_id}`,
            {
                headers: {
                    'authorization': `Bot ${process.env.BOT_TOKEN}`,
                },
            }
        )
    ).data;
};


const generateDiscordUserData = async (token) => {
    const auth = {};

    const userData = await getDiscordUserData(token);

    auth.id = userData.id;
    auth.username = userData.username;
    auth.avatar = userData.avatar;
    if (auth.avatar) auth.avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.jpg`;
    else auth.avatarUrl = `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`;
    auth.email = userData.email;
    auth.discriminator = userData.discriminator;

    const userGuilds = await getDiscordUserGuilds(token);
    const hasGuild = !!userGuilds.filter(guild => guild.id == process.env.GUILD_ID).length;
    // auth.roles = userGuildMember.roles;
    auth.hasGuild = hasGuild;
    auth.nick = '';
    auth.whitelist = false;
    // auth.staff = false;

    if (hasGuild) {
        const userGuildMember = await getDiscordUserGuildMember(userData.id);
        auth.nick = userGuildMember.nick ? userGuildMember.nick : '';
        auth.whitelist = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_WHITELIST_ID).length;
        // auth.staff = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_STAFF_ID).length;
    }

    return auth;
};

module.exports = {
    getDiscordTokenData,
    getDiscordUserData,
    getDiscordUserGuilds,
    getDiscordUserGuildMember,
    generateDiscordUserData,
};
