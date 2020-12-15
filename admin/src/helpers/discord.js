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
    auth.user.avatarUrl = generateUserAvatar(auth.user);

    auth.user.hasGuild = false;
    auth.user.nick = '';
    auth.user.isDirector = false;
    auth.user.isManager = false;
    auth.user.isLider = false;
    auth.user.isModerator = false;
    auth.user.isSuport = false;
    auth.user.isLevel1 = false;
    auth.user.isLevel2 = false;
    auth.user.isLevel3 = false;
    auth.user.isStaff = false;
    auth.user.roles = [];

    try {
        const userGuildMember = await getDiscordUserGuildMember(userData.id);

        auth.user.hasGuild = true;
        auth.user.nick = userGuildMember.nick ? userGuildMember.nick : '';
        auth.user.isDirector = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_DIRECTOR_ID).length;
        auth.user.isManager = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_MANAGER_ID).length;
        auth.user.isLider = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_LIDER_ID).length;
        auth.user.isModerator = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_MODERATOR_ID).length;
        auth.user.isSuport = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_SUPORT_ID).length;
        auth.user.isLevel1 = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_LEVEL_1_ID).length;
        auth.user.isLevel2 = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_LEVEL_2_ID).length;
        auth.user.isLevel3 = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_LEVEL_3_ID).length;
        auth.user.isStaff = !!userGuildMember.roles.filter(role_id => role_id == process.env.ROLE_STAFF_ID).length;
        auth.user.roles = userGuildMember.roles;

        const guildData = await getDiscordUserGuild(token);

        auth.guild = guildData;

        if (auth.guild.icon) {
            let ext = 'png';
            if (auth.guild.icon.indexOf('a_') === 0) ext = 'gif';
            auth.guild.avatar = `https://cdn.discordapp.com/icons/${auth.guild.id}/${auth.guild.icon}.${ext}`;
        } else {
            auth.guild.avatar = '';
        }

        auth.user.roles = generateUserRoles(auth.user.roles, auth.guild.roles);
        auth.user.roles.sort(sortRoles);
        auth.guild.roles.sort(sortRoles);
    } catch (e) {
    }

    return auth;
};

const generateUserAvatar = (user) => {
    let avatarUrl = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
    if (user.avatar) avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`;

    return avatarUrl;
};

const generateUserRoles = (user_roles, guild_roles, callback) => {
    if (typeof callback === 'undefined') callback = role => role;

    return user_roles.map(role_id => {
        let role = null;

        for (let i in guild_roles) {
            if (guild_roles[i].id == role_id) {
                role = guild_roles[i];
                break;
            }
        }

        return callback(role);
    });
};

const sortRoles = (a, b) => {
    if (a.position > b.position) return -1;
    if (a.position < b.position) return 1;
    else return 0;
};

const getDiscordGuildMembers = async (limit, after) => {
    if (typeof limit === 'undefined') limit = 1;
    if (typeof after === 'undefined') after = 0;
    return new Promise((resolve, reject) => {
        axios.get(
            `https://discord.com/api/guilds/${process.env.GUILD_ID}/members`,
            {
                params: {
                    limit,
                    after,
                },
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

module.exports = {
    getDiscordTokenData,
    getDiscordUserData,
    getDiscordUserGuilds,
    getDiscordUserGuildMember,
    generateDiscordUserData,
    generateUserAvatar,
    generateUserRoles,
    sortRoles,
    getDiscordGuildMembers,
};
