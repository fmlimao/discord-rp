const { clearAllCookies } = require('../../helpers/cookies');

module.exports = async (req, res) => {
    clearAllCookies(req, res);
    return res.redirect('/');
};