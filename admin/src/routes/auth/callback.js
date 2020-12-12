const { getDiscordTokenData } = require('../../helpers/discord');
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

        res.cookie('token', token);

        return res.redirect('/app');
    } catch (error) {
        clearAllCookies(req, res);
        return res.redirect('/');
    }
};