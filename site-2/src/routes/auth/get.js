const { generateDiscordUserData } = require('../../helpers/discord');
const { clearAllCookies } = require('../../helpers/cookies');

module.exports = async (req, res) => {
    try {
        const userData = await generateDiscordUserData(req);
        res.cookie('user', userData);

        return res.redirect('/');
    } catch (error) {
        clearAllCookies(res);
        return res.redirect('/');
    }
};