const {
    getDiscordGuildMembers,
    formatMember,
    sortUserByRole,
} = require('../../../helpers/discord');

module.exports = async (req, res) => {
    try {
        const members = (await getDiscordGuildMembers(1000))
            .map(member => {
                return formatMember(member, res.locals.guild.roles);
            })
            .sort((a, b) => {
                for (let i in res.locals.guild.roles) {
                    const hasRole = sortUserByRole(a, b, res.locals.guild.roles[i].id);
                    if (hasRole !== null) return hasRole;
                }

                if (a.usernameNick < b.usernameNick) return -1;
                else if (a.usernameNick > b.usernameNick) return 1;
                else return 0;
            });

        // return res.json({
        //     members
        // });

        res.render('app/players/list', {
            members,
            membersJson: JSON.stringify(members),
        });
    } catch (error) {
        res.json({
            error,
        });
    }
};