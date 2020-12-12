const axios = require('axios');

const getDiscordTokenData = async (code) => {
    return new Promise((resolve, reject) => {
        const data = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
            code: code,
            scope: 'identify email guilds',
        };

        axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams(data),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

const getDiscordUserData = async (token) => {
    return new Promise((resolve, reject) => {
        axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    'authorization': `${token.token_type} ${token.access_token}`,
                },
            }
        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

const getDiscordUserGuilds = async (token) => {
    return new Promise((resolve, reject) => {
        axios.get(
            'https://discord.com/api/users/@me/guilds',
            {
                headers: {
                    'authorization': `${token.token_type} ${token.access_token}`,
                },
            }
        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

const getDiscordUserGuild = async (user_id) => {
    return new Promise((resolve, reject) => {
        axios.get(
            `https://discord.com/api/guilds/${process.env.GUILD_ID}`,
            {
                headers: {
                    'authorization': `Bot ${process.env.BOT_TOKEN}`,
                },
            }
        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

const getDiscordUserGuildMember = async (user_id) => {
    return new Promise((resolve, reject) => {
        axios.get(
            `https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${user_id}`,
            {
                headers: {
                    'authorization': `Bot ${process.env.BOT_TOKEN}`,
                },
            }
        )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error.response.data);
            });
    });
};

const generateDiscordUserData = async (token) => {
    const auth = {
        user: {},
        guild: {},
    };

    const userData = await getDiscordUserData(token);

    auth.user = userData;
    if (auth.user.avatar) auth.user.avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.jpg`;
    else auth.user.avatarUrl = `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`;

    auth.user.hasGuild = false;
    auth.user.roles = [];
    auth.user.nick = '';
    auth.user.director = false;
    auth.user.manager = false;

    try {
        const userGuildMember = await getDiscordUserGuildMember(userData.id);

        auth.user.hasGuild = true;
        auth.user.roles = userGuildMember.roles;
        auth.user.nick = userGuildMember.nick ? userGuildMember.nick : '';
        auth.user.director = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_DIRECTOR_ID).length;
        auth.user.manager = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_MANAGER_ID).length;

        const guildData = await getDiscordUserGuild(token);

        auth.guild = guildData;

        if (auth.guild.icon) {
            let ext = 'png';
            if (auth.guild.icon.indexOf('a_') === 0) ext = 'gif';
            auth.guild.avatar = `https://cdn.discordapp.com/icons/${auth.guild.id}/${auth.guild.icon}.${ext}`;
        } else {
            auth.guild.avatar = '';
        }

        auth.user.roles = auth.user.roles.map(role_id => {
            let role = null;

            for (let i in auth.guild.roles) {
                if (auth.guild.roles[i].id == role_id) {
                    role = auth.guild.roles[i];
                    break;
                }
            }

            return role;
        });

        auth.user.roles.sort((a, b) => {
            if (a.position > b.position) return -1;
            if (a.position < b.position) return 1;
            else return 0;
        })

        auth.guild.roles.sort((a, b) => {
            if (a.position > b.position) return -1;
            if (a.position < b.position) return 1;
            else return 0;
        });
    } catch (e) {
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
