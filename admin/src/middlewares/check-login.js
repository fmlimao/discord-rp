const { generateDiscordUserData } = require('../helpers/discord');

module.exports = async (req, res, next) => {
    req.user = null;
    req.guild = null;

    try {
        if (!req.cookies.token) {
            throw new Error();
        }

        const token = req.cookies.token;
        // token.access_token = 'oi';

        const userData = await generateDiscordUserData(token);

        req.user = userData.user;
        req.guild = userData.guild;

        if (!req.user.director) {
            return res.render('app/unauthorized');
        }
    } catch (error) {
        // return res.json(error);
        return res.redirect('/auth/logout');
    }

    next();
};