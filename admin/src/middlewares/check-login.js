const { generateDiscordUserData } = require('../helpers/discord');

module.exports = async (req, res, next) => {
    res.locals.token = null;
    res.locals.user = null;
    res.locals.guild = null;

    try {
        if (!req.cookies.token) {
            throw new Error();
        }

        const token = req.cookies.token;
        // token.access_token = 'oi';

        const userData = await generateDiscordUserData(token);

        // return res.json({
        //     userData,
        // });

        res.locals.token = req.cookies.token;
        res.locals.user = userData.user;
        res.locals.guild = userData.guild;
    } catch (error) { }

    res.locals.tokenJson = JSON.stringify(res.locals.token);
    res.locals.userJson = JSON.stringify(res.locals.user);
    res.locals.guildJson = JSON.stringify(res.locals.guild);

    next();
};