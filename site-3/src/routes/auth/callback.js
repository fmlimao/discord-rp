const { getDiscordTokenData, generateDiscordUserData } = require('../../helpers/discord');
const { clearAllCookies } = require('../../helpers/cookies');

module.exports = async (req, res) => {
    try {
        const tokenData = await getDiscordTokenData(req.query.code);

        const token = {
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
        };

        const userData = await generateDiscordUserData(token);

        res.cookie('token', token);
        res.cookie('user', userData);

        return res.redirect('/site');
    } catch (error) {
        clearAllCookies(res);
        return res.redirect('/');
    }
};